import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from './models/restraurent_model';
import { CreateRestaurantDto } from './dtos/create_restraurent_input';
import { UpdateRestaurantDto } from './dtos/update_restraurent_input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class restraurentService {
    constructor(
    @InjectModel(Restaurant.name, 'ordersConnection') // must match connection name
    private readonly restaurantModel: Model<Restaurant>,
  ) {}


  /**
   * 🟢 Add (Register) a New Restaurant
   */
  async createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    try {
      const { name, type, password, confirmPassword, email, city } = createRestaurantDto;

      if (!name || !type) {
        throw new BadRequestException('Name and Type are required.');
      }

      // ✅ Check password confirmation
      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match.');
      }

      // ✅ Check if email already exists
      const existingEmail = await this.restaurantModel.findOne({ email });
      if (existingEmail) {
        throw new BadRequestException('Email already registered.');
      }

      // 🔍 Check if restaurant already exists with same name & city
      if (city && name) {
        const existing = await this.restaurantModel.findOne({ name, city });
        if (existing) {
          throw new BadRequestException('Restaurant with same name already exists in this city.');
        }
      }

      // // 🔐 Hash password using bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // // 🏗️ Create new restaurant entry
      const newRestaurant = new this.restaurantModel({
        ...createRestaurantDto,
        password: hashedPassword,
        isVerified: false,
        registrationDate: new Date(),
      });

      return await newRestaurant.save();
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create restaurant.');
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
    const updated = await this.restaurantModel.findByIdAndUpdate(id, updateDto, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      throw new BadRequestException('Restaurant not found or update failed.');
    }
    return updated;
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
