// register.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../models/user_Model';
import { Restaurant_details } from '../../models/restraurent_model';
import { CreateUserInput } from '../../dtos/create_user_input';

@Injectable()
export class RegisterService {
  constructor(
    @InjectModel(User.name, 'usersConnection')
    private readonly userModel: Model<User>,

    @InjectModel(Restaurant_details.name, 'usersConnection')
    private readonly restaurantModel: Model<Restaurant_details>,
  ) { }

  // ============================================================
  // ✅ Create User + Restaurant Details (if restaurant role)
  // ============================================================
  async createUser(createUserInput: CreateUserInput): Promise<User> {
    console.log("📩 Received CreateUserInput:", createUserInput);

    // Extract restaurant data
    const { restaurant, ...userData } = createUserInput;

    // STEP 1: Save User BASIC data
    const newUser = new this.userModel(userData);
    // console.log("🛠 Mongoose Final User to Save:", newUser);

    const savedUser = await newUser.save();
    // console.log("👤 User Saved:", savedUser);

    // ✔ If role is restaurant (roleId = 'r6') and restaurant data exists
    if (createUserInput.roleId === 'r6' && restaurant) {
      console.log("🏪 Saving Restaurant Details...");

      const restDoc = new this.restaurantModel({
        ...restaurant,
        userId: savedUser._id,  // linking
      });

      const savedRest = await restDoc.save();
      // console.log("🍽 Restaurant Saved:", savedRest);

      // Now update user with restaurantId
      savedUser.restaurantId = savedRest._id.toString();
      await savedUser.save();
    }

    return savedUser;
  }

  // ============================================================
  // GET ALL USERS
  // ============================================================
  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // ============================================================
  // GET USER BY ID
  // ============================================================
  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
