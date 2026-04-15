import { ObjectType, Field, ID, Int } from '@nestjs/graphql';


// 👤 Minimal User Info (returned after login)
@ObjectType()
export class UserBasicInfo {

  // 🆔 User ID
  @Field(() => ID)
  _id: string;

  // 📱 Mobile number
  @Field()
  mobile: string;

  // 👤 Name (optional for new users)
  @Field({ nullable: true })
  fullName?: string;

  // 📧 Email (optional)
  @Field({ nullable: true })
  email?: string;

  // ✅ Mobile verification status
  @Field()
  isMobileVerified: boolean;
}


// 🔐 Auth Response (after OTP verification)
@ObjectType()
export class AuthResponse {

  // 🔑 Access token (short-lived)
  @Field()
  accessToken: string;

  // 🔄 Refresh token (long-lived)
  @Field()
  refreshToken: string;

  // 👤 Logged-in user info
  @Field(() => UserBasicInfo)
  user: UserBasicInfo;

  // 🆕 Helps frontend decide onboarding flow
  @Field()
  isProfileCompleted: boolean;
}


// 📲 OTP Response
@ObjectType()
export class OtpResponse {
  @Field()
  success: boolean; // ✅ This must exist

  @Field()
  message: string;

  @Field(() => Int, { nullable: true })
  expiresIn?: number;
}