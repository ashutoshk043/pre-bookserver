import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginRestaurantDto } from '../dtos/login_restraurent_input';
import { Restaurant } from '../models/restraurent_model';
import { RestaurantLoginResponse } from '../dtos/login_responce';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@app/redis/redis.service';

@Injectable()
export class LoginserviceService {
  constructor(
    @InjectModel(Restaurant.name, 'ordersConnection')
    private readonly restaurantModel: Model<Restaurant>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService, // Redis inject
  ) {}

  async loginRestraurentUser(
    loginData: LoginRestaurantDto,
  ): Promise<RestaurantLoginResponse> {
    const { email, password } = loginData;

    // 🔹 Find user
    const user = await this.restaurantModel.findOne({ email }).exec();
    if (!user) throw new UnauthorizedException('User not found');

    // 🔹 Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    // 🔹 Generate JWT token (secret from env)
    const token = this.jwtService.sign(
      { rest_id: user._id, res_name: user.name },
      { expiresIn: '1d' } // 1 day expiry
    );

    // 🔹 Store JWT in Redis for 1 day (86400 seconds)
    await this.redisService.set(`rest_token_${user._id}`, token, 86400);

    console.log('✅ Login successful for:', user.email);
    console.log('🔑 JWT stored in Redis for 1 day');

    return { token };
  }
}
