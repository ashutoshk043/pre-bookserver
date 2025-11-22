import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
// import { LoginRestaurantDto } from '../dtos/login_restraurent_input';
import { Restaurant } from '../models/restraurent_model';
// import { RestaurantLoginResponse } from '../dtos/login_responce';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@app/redis/redis.service';
// import {restProfileDTO} from '../dtos/rest_profile_responce';

@Injectable()
export class LoginserviceService {
  constructor(
    @InjectModel(Restaurant.name, 'ordersConnection')
    private readonly restaurantModel: Model<Restaurant>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) { }

  // =======================================
  // 🍪 LOGIN (SET COOKIE via context.res)
  // =======================================
  // async loginRestraurentUser(
  //   loginData: LoginRestaurantDto,
  //   context?: any, // <-- context from resolver
  // ): Promise<RestaurantLoginResponse> {
  //   const { email, password } = loginData;

  //   // 🔹 Check if user exists
  //   const user = await this.restaurantModel.findOne({ email }).exec();
  //   if (!user) throw new UnauthorizedException('User not found');

  //   // 🔹 Check password
  //   const isPasswordValid = await bcrypt.compare(password, user.password);
  //   if (!isPasswordValid) throw new UnauthorizedException('Invalid password');


  //   // 🔹 Generate JWT
  //   const token = this.jwtService.sign(
  //     { rest_id: user._id, res_name: user.name },
  //     { expiresIn: '1d' },
  //   );

  //   // 🔹 Save token in Redis
  //   await this.redisService.set(`rest_token_${user._id}`, token, 86400);

  //   // 🔹 Set cookie using GraphQL context
  //   if (context?.res) {
  //     context.res.cookie('auth_token', token, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       sameSite: 'strict',
  //       maxAge: 86400 * 1000, // 1 day
  //     });
  //   }

  //   console.log(`✅ Login successful for: ${user.email}`);

  //   let restaurantProfile: restProfileDTO = {
  //     // 🔹 Basic Info
  //     name: user.name || '',
  //     ownerName: user.ownerName || '',
  //     type: user.type,

  //     // 🔹 Contact Info
  //     phone: user.phone || '',
  //     email: user.email || '',

  //     // 🔹 Location Details
  //     address: user.address || '',
  //     city: user.city || '',
  //     state: user.state || '',
  //     pincode: user.pincode || '',
  //     latitude: user.latitude || '',
  //     longitude: user.longitude || '',

  //     // 🔹 Legal Info
  //     fssaiNumber: user.fssaiNumber || '',
  //     gstNumber: user.gstNumber || '',
  //     panNumber: user.panNumber || '',

  //     // 🔹 Business Info
  //     registrationDate: user.registrationDate || new Date(), // default to current date
  //     openingTime: user.openingTime || '',
  //     closingTime: user.closingTime || '',
  //     isOpen: user.isOpen,
  //     rating: user.rating,
  //     totalOrders: user.totalOrders,

  //     // 🔹 Media / Branding
  //     logoUrl: user.logoUrl || 'https://via.placeholder.com/150?text=Restaurant+Logo',
  //     coverImageUrl: user.coverImageUrl || 'https://via.placeholder.com/600x200?text=Cover+Image',

  //     // 🔹 Misc
  //     description: user.description || 'Delicious food served with love ❤️',
  //     isVerified: user.isVerified ?? false,
  //   };

  //   return { token , restaurantProfile};
  // }

  // =======================================
  // 🍪 LOGOUT (CLEAR COOKIE via context.res)
  // =======================================
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



// async fetchRestDetails(rest_id: string): Promise<restProfileDTO | null> {
//     try {
//       const restaurant = await this.restaurantModel.findById(rest_id).lean();

//       if (!restaurant) {
//         // console.warn(`⚠️ No restaurant found for ID: ${rest_id}`);
//         return null;
//       }

//       // 🔹 Map only fields defined in DTO (optional safeguard)
//       const restProfile: restProfileDTO = {
//         name: restaurant.name ?? '',
//         ownerName: restaurant.ownerName ?? '',
//         type: restaurant.type ?? '',
//         phone: restaurant.phone ?? '',
//         email: restaurant.email ?? '',
//         address: restaurant.address ?? '',
//         city: restaurant.city ?? '',
//         state: restaurant.state ?? '',
//         pincode: restaurant.pincode ?? '',
//         latitude: restaurant.latitude ?? '',  
//         longitude: restaurant.longitude ?? '',
//         fssaiNumber: restaurant.fssaiNumber ?? '',
//         gstNumber: restaurant.gstNumber ?? '',
//         panNumber: restaurant.panNumber ?? '',
//         registrationDate: restaurant.registrationDate ?? new Date(),
//         openingTime: restaurant.openingTime ?? '',
//         closingTime: restaurant.closingTime ?? '',
//         isOpen: restaurant.isOpen ?? false,
//         rating: restaurant.rating ?? 0,
//         totalOrders: restaurant.totalOrders ?? 0,
//         logoUrl: restaurant.logoUrl ?? '',
//         coverImageUrl: restaurant.coverImageUrl ?? '',
//         description: restaurant.description ?? '',
//         isVerified: restaurant.isVerified ?? false,
//       };

//       // console.log(`📦 Returning sanitized profile for: ${restaurant.name}`);
//       return restProfile;
//     } catch (err) {
//       console.error('❌ Error fetching restaurant details:', err);
//       throw new Error('Internal server error while fetching restaurant profile');
//     }
//   }





}
