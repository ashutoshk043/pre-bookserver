import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AppUser } from '../schemas/app-user.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@app/redis/redis.service';

import {
  generateOtp,
  hashData,
  compareHash,
  generateTokens,
  normalizeMobile,
  otpKey,
  otpLimitKey,
  otpAttemptKey,
} from '../common/utils';

import { SendOtpInput } from '../dtos/send-otp.input';
import { VerifyOtpInput } from '../dtos/verify-otp.input';
import { UpdateProfileInput } from '../schemas/update-profile.input';
import { UserAddress } from '../schemas/user-address.model';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(AppUser.name, 'usersConnection')
    private appUserModel: Model<AppUser>,
     @InjectModel(UserAddress.name, 'usersConnection')
    private addressModel: Model<UserAddress>,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) { }

  // =========================
  // 📲 SEND OTP
  // =========================
  async sendOtp(input: SendOtpInput) {
    let { mobile, countryCode, deviceId, deviceType, ipAddress } = input;

    mobile = normalizeMobile(mobile);

    // 🚫 Rate limit (1 OTP / 60 sec)
    const limit = await this.redisService.get(otpLimitKey(mobile));
    if (limit) {
      throw new UnauthorizedException('Too many requests. Try later');
    }

    // 👤 Find or create user
    let user = await this.appUserModel.findOne({ mobile });

if (!user) {
  user = await this.appUserModel.create({
    mobile,
    countryCode,
    isMobileVerified: false,
    isProfileCompleted: false,
  });
}

    // 🔢 Generate OTP
    const otp = generateOtp();
    const hashedOtp = await hashData(otp);

    // 💾 Store OTP (5 min)
    await this.redisService.set(otpKey(mobile), hashedOtp, 300);

    // 🚫 Rate limit key (60 sec)
    await this.redisService.set(otpLimitKey(mobile), '1', 60);

    // 🔁 Reset attempts
    await this.redisService.set(otpAttemptKey(mobile), '0', 300);

    // 📊 Logging (optional)
    console.log(`OTP for ${mobile}:`, otp);
    console.log({ deviceId, deviceType, ipAddress });

    // 👉 Replace with SMS API (MSG91 / WhatsApp)
    // ✅ Add success: true to the return
return {
  success: true,
  message: 'OTP sent successfully',
  expiresIn: 300,
};
  }

  // =========================
  // ✅ VERIFY OTP
  // =========================
async verifyOtp(input: VerifyOtpInput) {
  let { mobile, otp, deviceId, deviceType, ipAddress } = input;

  mobile = normalizeMobile(mobile);

  const storedHash = await this.redisService.get(otpKey(mobile));

  if (!storedHash) {
    throw new UnauthorizedException('OTP expired');
  }

  const attemptsRaw = await this.redisService.get(otpAttemptKey(mobile));
  const attempts = Number(attemptsRaw ?? 0);

  if (attempts >= 5) {
    throw new UnauthorizedException('Too many attempts');
  }

  const isValid = await compareHash(otp, storedHash);

  if (!isValid) {
    await this.redisService.set(
      otpAttemptKey(mobile),
      (attempts + 1).toString(),
      300,
    );
    throw new UnauthorizedException('Invalid OTP');
  }

  // 👤 Get user
  const user = await this.appUserModel.findOne({ mobile });

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  const userId = user._id;
  const roleId = user.roles[0];

  // ✅ Ensure referral code exists (ONLY ONCE)
  let referralCode = user.referralCode;

  if (!referralCode) {
    referralCode = generateReferralCode(user);

    await this.appUserModel.updateOne(
      { _id: userId },
      { $set: { referralCode } }
    );
  }

  // ✅ Mark verified
  await this.appUserModel.updateOne(
    { _id: userId },
    { $set: { isMobileVerified: true } }
  );

  // 🔐 Generate tokens
  const tokens = await generateTokens(this.jwtService, {
    user_id: userId.toString(),
    mobile,
    roleId: roleId
  });

  const hashedRefresh = await hashData(tokens.refreshToken);

  await this.appUserModel.updateOne(
    { _id: userId },
    { refreshToken: hashedRefresh },
  );

  // 🧹 Cleanup
  await this.redisService.delete(otpKey(mobile));
  await this.redisService.delete(otpAttemptKey(mobile));

  // 📊 Logging
  console.log('Login success:', { mobile, user });

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,

    isProfileCompleted: user.isProfileCompleted ?? false,

    user: {
      _id: user._id.toString(),
      mobile: user.mobile,
      fullName: user.fullName,
      email: user.email,
      isMobileVerified: true,
      referralCode, // ✅ stable (not regenerated every login)
    },
  };

  function generateReferralCode(user: { _id: any; fullName?: string }): string {
  const namePart = (user.fullName ?? 'USER')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, '')  // strip spaces, numbers, special chars
    .slice(0, 4)
    .padEnd(4, 'X');          // pad if name is too short e.g. "AJ" → "AJXX"

  const idPart = user._id
    .toString()
    .slice(-4)
    .toUpperCase();

  return `${namePart}${idPart}`;  // e.g. "RAHM4F2A"
}
}



  // =========================
  // 🔁 REFRESH TOKEN
  // =========================
async refreshToken(token: string) {

  // console.log(token, "payload token");

  try {
    // 1. Verify token
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    // console.log(payload, "payload 2222222");

    const user = await this.appUserModel.findById(payload.user_id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    // 2. Compare hash
    const isValid = await compareHash(token, user.refreshToken);

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 3. Generate new tokens
    const tokens = await generateTokens(this.jwtService, {
      user_id: user._id.toString(),
      mobile: user.mobile,
      roleId: user.roles[0],
    });

    // ✅ 4. RETURN USER ALSO
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,

      isProfileCompleted: user.isProfileCompleted ?? false,

      user: {
        _id: user._id.toString(),
        mobile: user.mobile,
        fullName: user.fullName,
        email: user.email,
        isMobileVerified: user.isMobileVerified,
        referralCode: user.referralCode,
      },
    };

  } catch (err) {
    console.log(err.message);
    throw new UnauthorizedException('Refresh token expired');
  }
}

   async updateProfile(userId: string, input: UpdateProfileInput) {
    // ── Check email not already used by another user
    if (input.email) {
      const existing = await this.appUserModel.findOne({
        email: input.email.toLowerCase().trim(),
        _id: { $ne: userId },
      });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    const user = await this.appUserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ── Update fields
    user.fullName         = input.fullName.trim();
    user.email            = input.email.toLowerCase().trim();
    user.dateOfBirth      = new Date(input.dateOfBirth);
    user.gender           = input.gender;
    user.isProfileCompleted = true; // ✅ mark profile as complete

    await user.save();

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  }


async getMyFullProfile(userId: string) {
  try {
    const user = await this.appUserModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const addresses = await this.addressModel.find({ userId });

return {
  _id: user._id.toString(),
  mobile: user.mobile,
  fullName: user.fullName,
  email: user.email,
  isMobileVerified: user.isMobileVerified,
  isProfileCompleted: user.isProfileCompleted,
  dateOfBirth:user?.dateOfBirth,
  gender:user?.gender,

  // ✅ ADD THESE
  rewardPoints: user.rewardPoints,
  walletBalance: user.walletBalance,
  totalOrders: user.totalOrders,
  totalSpent: user.totalSpent,
  roles: user.roles,
  preferredLanguage: user.preferredLanguage,
  referralCode: user.referralCode,

  addresses: addresses?.map(addr => ({
    _id: addr._id.toString(),
    label: addr.label,
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    isDefault: addr.isDefault,
  })),
};

  } catch (error) {
    // 🔥 FULL ERROR LOG (VERY IMPORTANT)
    console.error('❌ getMyFullProfile ERROR:', {
      message: error.message,
      stack: error.stack,
      userId,
    });

    // ✅ अगर known error है (like NotFoundException), वही throw करो
    if (error instanceof NotFoundException) {
      throw error;
    }

    // ✅ बाकी unknown errors को safe error में convert करो
    throw new InternalServerErrorException(
      'Something went wrong while fetching profile'
    );
  }
}



}