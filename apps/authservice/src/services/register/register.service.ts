// register.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../models/user_Model';
import { Restaurant_details } from '../../models/restraurent_model';
import { CreateUserInput } from '../../dtos/create_user_input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@app/redis/redis.service';
import { States } from '../../models/state_model';
import { Districts } from '../../models/distric_model';
import { SubDistricts } from '../../models/subdistrict_model';
import { Villages } from '../../models/villagemodel';
import { UpdateUserInput } from '../../dtos/update_user_input';

@Injectable()
export class RegisterService {
  constructor(
    @InjectModel(User.name, 'usersConnection')
    private readonly userModel: Model<User>,

    @InjectModel(Restaurant_details.name, 'usersConnection')
    private readonly restaurantModel: Model<Restaurant_details>,

    @InjectModel(States.name, 'usersConnection')
    private readonly stateModel: Model<States>,

    @InjectModel(Districts.name, 'usersConnection')
    private readonly districtModel: Model<Districts>,

    @InjectModel(SubDistricts.name, 'usersConnection')
    private readonly subdistrictModel: Model<SubDistricts>,

    @InjectModel(Villages.name, 'usersConnection')
    private readonly villageModel: Model<Villages>,

    private readonly redisService: RedisService,
  ) { }

  // ============================================================
  // ✅ Create User + Restaurant Details (if restaurant role)
  // ============================================================
  async createUser(createUserInput: CreateUserInput): Promise<User> {
    console.log("📩 Received CreateUserInput:", createUserInput);

    const { password, confirmPassword, email, phone, ...userData } = createUserInput;
    let savedUser: User | null = null;

    try {
      // STEP 0: Password validation
      if (password !== confirmPassword) {
        throw new Error("Password and Confirm Password do not match");
      }

      // 🔐 Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // STEP 1: Check for duplicate user by email or phone
      const existingUser = await this.userModel.findOne({
        $or: [{ email }, { phone }],
      });

      if (existingUser) {
        throw new Error('User with this email or phone already exists');
      }

      // STEP 2: Save user basic data with hashed password
      const newUser = new this.userModel({
        email,
        phone,
        password: hashedPassword,
        ...userData,
      });

      savedUser = await newUser.save();

      return savedUser;
    } catch (error) {
      console.error("❌ Error creating user:", error);

      // Manual rollback if user was already saved
      if (savedUser && savedUser._id) {
        try {
          await this.userModel.findByIdAndDelete(savedUser._id);
          console.log("♻️ Rolled back user creation");
        } catch (rollbackError) {
          console.error("⚠️ Failed to rollback user:", rollbackError);
        }
      }

      throw error;
    }
  }

  // ============================================================
  // GET ALL USERS
  // ============================================================
  async findAllUsers(restId: any): Promise<User[]> {
    if (restId == 'all') {
      return this.userModel.find().sort({ _id: -1 }).exec();
    } else {
      return this.userModel
        .find({ restaurantId: restId })
        .sort({ _id: -1 })
        .exec();
    }
  }


  // ============================================================
  // GET USER BY ID
  // ============================================================
  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
  async logoutRestraurentUser(
    rest_id: string,
    context?: any,
  ): Promise<{ message: string }> {
    const tokenKey = `rest_token_${rest_id}`;
    console.log(`🔍 Trying to logout restaurant with ID: ${rest_id}`);
    console.log(`🧩 Redis token key: ${tokenKey}`);

    // 🔹 Check token in Redis
    const existingToken = await this.redisService.get(tokenKey);
    console.log(`📦 Existing token in Redis:`, existingToken);

    if (!existingToken) {
      console.log(`⚠️ No token found for restaurant ID: ${rest_id}`);
      return { message: 'User already logged out or invalid session' };
    }

    // 🔹 Remove token from Redis
    await this.redisService.delete(tokenKey);
    console.log(`🗑️ Token deleted from Redis for restaurant ID: ${rest_id}`);

    // 🔹 Clear auth_token cookie
    if (context?.res) {
      console.log(`🍪 Clearing auth_token cookie...`);
      context.res.clearCookie('auth_token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
    } else {
      console.log(`⚠️ No response context found to clear cookie.`);
    }

    console.log(`✅ Logout successful for restaurant ID: ${rest_id}`);
    return { message: 'Logout successful' };
  }



  async deleteUser(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId).exec();

    if (!deletedUser) {
      throw new Error('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  async getAllStates() {
    const allStates = await this.stateModel.find().exec()
    return allStates;
  }

  async getAllDistricts(stateName: string): Promise<Districts[]> {
    return await this.districtModel.find({ stateName }).exec();
  }

  async getAllSubDistricts(districtName: string): Promise<SubDistricts[]> {
    return await this.subdistrictModel.find({ districtName }).exec();
  }
  async getAllVillages(subDistrictName: string): Promise<Villages[]> {
    // console.log("📌 getAllVillages() called with subDistrictName:", subDistrictName);

    const villages = await this.villageModel
      .find({ subDistrictName })
      .collation({ locale: "en", strength: 1 })   // important for A–Z sorting
      .sort({ villageName: 1 })                   // sort by villageName
      .exec();

    return villages;
  }


  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    const { id, ...updateData } = updateUserInput;

    // If password not provided, don’t update it
    if (!updateData.password) {
      delete updateData.password;
      delete updateData.confirmPassword;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedUser) throw new Error("User not found");

    return updatedUser;
  }


  async findUsersWithPagination({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) {
  const query: any = {};

  if (search) {
    query.email = { $regex: search, $options: 'i' };
  }

  const total = await this.userModel.countDocuments(query);

  const users = await this.userModel
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .select('email');

  return { users, total };
}





}
