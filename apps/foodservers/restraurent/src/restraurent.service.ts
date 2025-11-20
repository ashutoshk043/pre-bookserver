import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from './models/restraurent_model';
import { CreateRestaurantDto } from './dtos/create_restraurent_input';
import { UpdateRestaurantDto } from './dtos/update_restraurent_input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class restraurentService {

  private readonly logger = new Logger(restraurentService.name);

  constructor(
    @InjectModel(Restaurant.name, 'ordersConnection') // must match connection name
    private readonly restaurantModel: Model<Restaurant>,
  ) { }


  /**
   * 🟢 Add (Register) a New Restaurant
   */
  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    try {
      const {
        name,
        type,
        password,
        confirmPassword,
        email,
      } = createRestaurantDto;

      // 🧩 Required checks
      if (!name || !type) {
        throw new BadRequestException('Name and Type are required.');
      }

      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match.');
      }

      // 🔐 Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 🏗️ Create & save new restaurant (atomic)
      const restaurant = new this.restaurantModel({
        ...createRestaurantDto,
        password: hashedPassword,
        isVerified: false,
        registrationDate: new Date(),
      });

      const saved = await restaurant.save();
      this.logger.log(`✅ Restaurant registered: ${saved.name}`);
      return saved;

    } catch (error) {
      // ⚠️ Handle duplicate key errors from Mongo
      if (error.code === 11000) {
        if (error.keyPattern?.email) {
          throw new BadRequestException('Email already registered.');
        }
        if (error.keyPattern?.name && error.keyPattern?.city) {
          throw new BadRequestException(
            'Restaurant with same name already exists in this city.',
          );
        }
      }

      this.logger.error('❌ Restaurant registration failed', error);
      throw new BadRequestException(
        error.message || 'Failed to create restaurant.',
      );
    }
  }

  /**
   * 🟡 Get All Restaurants
   */
  async getAllRestaurants(): Promise<Restaurant[]> {
    return this.restaurantModel.find().sort({ createdAt: -1 }).exec();
  }

  /**
   * 🔵 Get Restaurant by ID
   */
  async getRestaurantById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findById(id).exec();
    if (!restaurant) {
      throw new BadRequestException('Restaurant not found.');
    }
    return restaurant;
  }

  /**
   * 🟠 Update Restaurant Info (for admin or owner)
   */
async updateRestaurant(id: string, updateDto: UpdateRestaurantDto): Promise<Restaurant> {
  console.log('==============================');
  console.log('🔹 [Update Request Received]');
  console.log('Restaurant ID:', id);
  console.log('Update Payload:', JSON.stringify(updateDto, null, 2));
  console.log('==============================');

  try {
    console.log('🔍 Finding and updating restaurant...');
    const updated = await this.restaurantModel.findByIdAndUpdate(id, updateDto, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      console.error('❌ Restaurant not found or update failed.');
      throw new BadRequestException('Restaurant not found or update failed.');
    }

    console.log('✅ [Update Successful]');
    console.log('Updated Restaurant:', JSON.stringify(updated, null, 2));
    console.log('==============================');

    return updated;
  } catch (error) {
    console.error('🚨 [Error while updating restaurant]:', error.message);
    console.log('==============================');
    throw error;
  }
}


  /**
   * 🔴 Delete Restaurant
   */
  async deleteRestaurant(id: string): Promise<boolean> {
    const deleted = await this.restaurantModel.findByIdAndDelete(id);
    return !!deleted;
  }

  /**
   * 🔹 Just a test method (optional)
   */
  getHello(): string {
    return 'Hello Restaurant Service is running!';
  }
}
