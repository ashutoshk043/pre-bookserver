import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RestraurentLoginDTO } from '../../dtos/restraurent_login_input';
import { RestaurantLoginResponse } from '../../dtos/restraurent_login_responce';
import { User } from '../../models/user_Model';
import { userProfileResponce } from '../../dtos/user_profile_responce';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@app/redis/redis.service';
import * as bcrypt from 'bcrypt';
import { Restaurant_details } from '../../models/restraurent_model';

@Injectable()
export class RestraurentloginService {

   constructor(
  @InjectModel(User.name, 'usersConnection')
  private readonly userModel: Model<User>,

  @InjectModel(Restaurant_details.name, 'usersConnection')
  private readonly restraurentModel: Model<Restaurant_details>,

  private readonly jwtService: JwtService,
  private readonly redisService: RedisService,
) {}


    async loginRestraurent(
        loginData: RestraurentLoginDTO,
        context?: any,
    ): Promise<RestaurantLoginResponse> {

        const { email, password } = loginData;

        // 🔹 Check if user exists
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) throw new UnauthorizedException('User not found');

        // 🔹 Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid password');



        const restaurantDetails = await this.restraurentModel
            .findOne({ _id: user.restaurantId })
            .select({ restaurantName: 1 });

        // 🔹 Generate JWT
        const token = this.jwtService.sign(
            { user_id: user._id, res_id: user.restaurantId, rest_name: restaurantDetails?.restaurantName },
            { expiresIn: '1d' },
        );

        // 🔹 Save session token in Redis
        await this.redisService.set(`rest_token_${user._id}`, token, 86400);

        // 🔹 Set cookie
        if (context?.res) {
            context.res.cookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400 * 1000,
            });
        }

        // 🔹 Create response profile
        const userProfile: userProfileResponce = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            state: user.state,
            district: user.district,
            block: user.block,
            village: user.village,
            roleId: user.roleId,
            status: user.status,
            profile: user.profile,
        };

        return { token, userProfile };
    }


}
