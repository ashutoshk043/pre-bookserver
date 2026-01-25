
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RestraurentLoginDTO } from '../../dtos/restraurent_login_input';
import { User } from '../../models/user_Model';
import { userProfileResponce } from '../../dtos/user_profile_responce';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@app/redis/redis.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserloginService {
    constructor(
        @InjectModel(User.name, 'usersConnection')
        private readonly userModel: Model<User>,

        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
    ) { }

    async loginUser(
        loginData: RestraurentLoginDTO,
        context?: any,
    ): Promise<{ accessToken: string; refreshToken: string; userProfile: userProfileResponce }> {

        const { email, password } = loginData;

        // 🔹 Check if user exists
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // 🔹 Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        // 🔹 Generate Access Token (short-lived)
        const accessToken = this.jwtService.sign(
            {
                user_id: user._id.toString(),
                roleId: user.roleId,
            },
            { expiresIn: '15m' }, // short-lived token
        );

        // 🔹 Generate Refresh Token (long-lived)
        const refreshToken = this.jwtService.sign(
            {
                user_id: user._id.toString(),
                roleId: user.roleId,
            },
            { expiresIn: '3d' }, // long-lived token
        );

        // 🔹 Save refresh token in Redis (optional, for token invalidation)
        await this.redisService.set(`refresh_token_${user._id}`, refreshToken, 3 * 24 * 60 * 60);

        // // 🔹 Set HttpOnly cookie for refresh token
        // if (context?.res) {
        //     context.res.cookie('refresh_token', refreshToken, {
        //         httpOnly: true,
        //         sameSite: 'strict',
        //         secure: process.env.NODE_ENV === 'production',
        //         maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
        //         path: '/', // 🔥 IMPORTANT
        //     });
        // }


        // 🔹 User profile (no password)
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

        // 🔹 Return both tokens + user profile
        return {
            accessToken,
            refreshToken,
            userProfile,
        };
    }


    async refreshAccessToken(refreshToken: string) {
        try {
            // 1️⃣ Verify refresh token
            const payload = this.jwtService.verify(refreshToken);

            const userId = payload.user_id;
            const roleId = payload.roleId;

            // 2️⃣ Check token in Redis
            const storedToken = await this.redisService.get(
                `refresh_token_${userId}`,
            );

            if (!storedToken || storedToken !== refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            // 3️⃣ Generate NEW tokens
            const newAccessToken = this.jwtService.sign(
                { user_id: userId, roleId },
                { expiresIn: '15m' },
            );

            const newRefreshToken = this.jwtService.sign(
                { user_id: userId, roleId },
                { expiresIn: '3d' },
            );

            // 4️⃣ Rotate refresh token
            await this.redisService.set(
                `refresh_token_${userId}`,
                newRefreshToken,
                3 * 24 * 60 * 60, // 3 days
            );

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch (err) {
            throw new UnauthorizedException('Refresh token expired or invalid');
        }
    }






}
