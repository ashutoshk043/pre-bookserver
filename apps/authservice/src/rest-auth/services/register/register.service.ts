// register.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../models/user_Model';
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

    @InjectModel(States.name, 'usersConnection')
    private readonly stateModel: Model<States>,

    @InjectModel(Districts.name, 'usersConnection')
    private readonly districtModel: Model<Districts>,

    @InjectModel(SubDistricts.name, 'usersConnection')
    private readonly subdistrictModel: Model<SubDistricts>,

    @InjectModel(Villages.name, 'usersConnection')
    private readonly villageModel: Model<Villages>,

    private readonly redisService: RedisService,

    private jwtService: JwtService,
  ) { }

  // ============================================================
  // ✅ Create User + Restaurant Details (if restaurant role)
  // ============================================================
  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const { password, confirmPassword, email, phone, ...userData } =
      createUserInput;
    let savedUser: User | null = null;

    try {
      // STEP 0: Password validation
      if (password !== confirmPassword) {
        throw new Error('Password and Confirm Password do not match');
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
        ...(userData.zone && { zone: new Types.ObjectId(userData.zone) }),
      });

      savedUser = await newUser.save();

      return savedUser;
    } catch (error) {
      console.error('❌ Error creating user:', error);

      // Manual rollback if user was already saved
      if (savedUser && savedUser._id) {
        try {
          await this.userModel.findByIdAndDelete(savedUser._id);
          console.log('♻️ Rolled back user creation');
        } catch (rollbackError) {
          console.error('⚠️ Failed to rollback user:', rollbackError);
        }
      }

      throw error;
    }
  }

  // ============================================================
  // GET ALL USERS
  // ============================================================
  async findAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().sort({ _id: -1 }).exec();

    // console.log('📊 Total users fetched:', users.length);

    return users;
  }

  // ============================================================
  // GET USER BY ID
  // ============================================================
  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
  async logoutUser(context: any): Promise<{ message: string }> {
    const req = context.req;
    const res = context.res;

    // 1️⃣ Get token from cookie / header
    const token =
      req.cookies?.auth_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return { message: 'Already logged out' };
    }

    // 2️⃣ Verify token
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      return { message: 'Session already expired' };
    }

    const restId = payload.user_id;

    // 3️⃣ Delete token from Redis
    const redisKey = `rest_token_${restId}`;

    console.log(redisKey, 'redisKey logged out');

    await this.redisService.delete(redisKey);

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
    const allStates = await this.stateModel.find().exec();
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
      .collation({ locale: 'en', strength: 1 }) // important for A–Z sorting
      .sort({ villageName: 1 }) // sort by villageName
      .exec();

    return villages;
  }
  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    const { id, password, confirmPassword, ...rest } = updateUserInput;

    const updateData: any = { ...rest };

    // ✅ Convert zone string → ObjectId
    if (updateData.zone) {
      updateData.zone = new Types.ObjectId(updateData.zone);
    }

    // ✅ Password update handling
    if (password && password.trim() !== '') {
      if (password !== confirmPassword) {
        throw new Error('Password and confirm password do not match');
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

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

  async addRestaurantToUser(ownerEmail: string, restaurantId: string) {
    // console.log('🔍 Finding user with email:', ownerEmail);

    const user = await this.userModel.findOne({ _id: ownerEmail });

    if (!user) {
      console.error('❌ User not found:', ownerEmail);
      throw new Error('User not found');
    }

    if (!user.restaurantIds) {
      // console.log('🆕 Initializing restaurantIds array');
      user.restaurantIds = [];
    }

    if (!user.restaurantIds.includes(restaurantId)) {
      // console.log('➕ Adding restaurantId:', restaurantId);
      user.restaurantIds.push(restaurantId);
      await user.save();
    } else {
      // console.log('ℹ️ Restaurant already linked:', restaurantId);
    }

    return {
      id: user._id.toString(),
      email: user.email,
      restaurantIds: user.restaurantIds,
    };
  }
}
