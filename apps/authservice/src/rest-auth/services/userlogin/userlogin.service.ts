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
  ) {}

  async loginUser(
    loginData: RestraurentLoginDTO,
    context?: any,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    userProfile: any;
  }> {
    const { email, password } = loginData;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // ✅ Access token: 1 DAY (24 hours = 86400 seconds)
    const accessToken = this.jwtService.sign(
      {
        user_id: user._id.toString(),
        roleId: user.roleId,
        email: user.email,
        tokenType: 'access',
      },
      { expiresIn: '1d' }, // 1 day
    );

    // ✅ Refresh token: 7 DAYS (604800 seconds)
    const refreshToken = this.jwtService.sign(
      {
        user_id: user._id.toString(),
        roleId: user.roleId,
        tokenType: 'refresh',
      },
      { expiresIn: '7d' }, // 7 days
    );

    const decodedAccess = this.jwtService.decode(accessToken);
    const decodedRefresh = this.jwtService.decode(refreshToken);
    
    console.log('\n📝 [LOGIN] ========================================');
    console.log(`✅ User logged in: ${user.email}`);
    console.log(`📅 Current time: ${new Date().toISOString()}`);
    console.log(`🔐 Access token expires in: 1 day (24 hours)`);
    console.log(`🔐 Access token expires at: ${new Date((decodedAccess as any).exp * 1000).toISOString()}`);
    console.log(`🔄 Refresh token expires in: 7 days`);
    console.log(`🔄 Refresh token expires at: ${new Date((decodedRefresh as any).exp * 1000).toISOString()}`);
    console.log('========================================\n');

    // Save refresh token in Redis with 7 days TTL
    const redisTTL = 7 * 24 * 60 * 60; // 7 days in seconds
    await this.redisService.set(
      `refresh_token_${user._id}`,
      refreshToken,
      redisTTL,
    );
    
    // Verify Redis storage
    const storedToken = await this.redisService.get(`refresh_token_${user._id}`);
    const redisTtl = await this.redisService.ttl(`refresh_token_${user._id}`);
    console.log(`✅ [REDIS] Refresh token stored with TTL: ${redisTtl} seconds (${Math.floor(redisTtl / 86400)} days)`);
    
    const userProfile = {
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

    return {
      accessToken,
      refreshToken,
      userProfile,
    };
  }

  async restaurentRefreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    console.log('\n🔄 [REFRESH] ========================================');
    console.log('🔄 Refresh request received');
    console.log(`📝 Token preview: ${refreshToken.substring(0, 30)}...`);
    
    try {
      // Verify the refresh token
      console.log('🔐 Verifying refresh token...');
      const decoded = this.jwtService.verify(refreshToken);
      
      // Check token type
      if (decoded.tokenType && decoded.tokenType !== 'refresh') {
        console.error('❌ Invalid token type:', decoded.tokenType);
        throw new UnauthorizedException('Invalid token type');
      }
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp <= now) {
        console.error('❌ Refresh token has expired');
        console.log(`   Expired at: ${new Date(decoded.exp * 1000).toISOString()}`);
        console.log(`   Expired ${now - decoded.exp} seconds ago`);
        throw new UnauthorizedException('Refresh token expired');
      }
      
      console.log(`✅ Token verified for user: ${decoded.user_id}`);
      console.log(`   Token expires at: ${new Date(decoded.exp * 1000).toISOString()}`);
      console.log(`   Valid for: ${Math.floor((decoded.exp - now) / 86400)} days ${Math.floor(((decoded.exp - now) % 86400) / 3600)} hours`);

      // Check Redis for stored token
      const redisKey = `refresh_token_${decoded.user_id}`;
      console.log(`🔍 Checking Redis key: ${redisKey}`);
      
      const storedToken = await this.redisService.get(redisKey);
      const redisTtl = await this.redisService.ttl(redisKey);
      console.log(`   Redis TTL: ${redisTtl} seconds (${Math.floor(redisTtl / 86400)} days)`);
      
      if (!storedToken) {
        console.error('❌ No token found in Redis');
        throw new UnauthorizedException('Refresh token not found');
      }
      
      if (storedToken !== refreshToken) {
        console.error('❌ Token mismatch');
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      console.log('✅ Redis validation passed');

      // Generate NEW tokens
      console.log('📝 Generating new tokens...');
      
      // New access token: 1 day
      const newAccessToken = this.jwtService.sign(
        {
          user_id: decoded.user_id,
          roleId: decoded.roleId,
          tokenType: 'access',
        },
        { expiresIn: '1d' }, // 1 day
      );

      // New refresh token: 7 days
      const newRefreshToken = this.jwtService.sign(
        {
          user_id: decoded.user_id,
          roleId: decoded.roleId,
          tokenType: 'refresh',
        },
        { expiresIn: '7d' }, // 7 days
      );

      // Decode new tokens for logging
      const decodedNewAccess = this.jwtService.decode(newAccessToken);
      const decodedNewRefresh = this.jwtService.decode(newRefreshToken);
      
      console.log('✅ New tokens generated:');
      console.log(`   New access token expires: ${new Date((decodedNewAccess as any).exp * 1000).toISOString()}`);
      console.log(`   New refresh token expires: ${new Date((decodedNewRefresh as any).exp * 1000).toISOString()}`);

      // Update Redis with new refresh token (7 days)
      const newRedisTTL = 7 * 24 * 60 * 60; // 7 days
      await this.redisService.set(redisKey, newRefreshToken, newRedisTTL);
      
      // Verify Redis update
      const verifyStored = await this.redisService.get(redisKey);
      const newRedisTtl = await this.redisService.ttl(redisKey);
      console.log(`✅ Redis updated with new refresh token`);
      console.log(`   New Redis TTL: ${newRedisTtl} seconds (${Math.floor(newRedisTtl / 86400)} days)`);
      
      console.log('🎉 Refresh completed successfully');
      console.log('========================================\n');
      
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error('❌ Refresh failed:', error.message);
      
      if (error.message === 'jwt expired' || error.name === 'TokenExpiredError') {
        console.log('💀 Refresh token has expired - user must login again');
      } else if (error.name === 'JsonWebTokenError') {
        console.log('🔏 Invalid token signature - possible tampering');
      }
      
      console.log('========================================\n');
      
      // Throw specific error for expired token
      if (error.message === 'jwt expired' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired. Please login again.');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // ============================================================
  // 🔹 UTILITY METHODS
  // ============================================================

  /**
   * Check token status for a user
   */
  async checkTokenStatus(userId: string): Promise<any> {
    console.log(`\n🔍 [DEBUG] Checking token status for user: ${userId}`);
    
    const redisKey = `refresh_token_${userId}`;
    const storedToken = await this.redisService.get(redisKey);
    const redisTtl = await this.redisService.ttl(redisKey);
    
    if (!storedToken) {
      return { 
        exists: false, 
        message: 'No refresh token found in Redis' 
      };
    }
    
    try {
      const decoded = this.jwtService.decode(storedToken);
      const now = Math.floor(Date.now() / 1000);
      const timeToExpiry = decoded.exp - now;
      
      const result = {
        exists: true,
        isValid: timeToExpiry > 0,
        userId: decoded.user_id,
        tokenType: decoded.tokenType,
        issuedAt: new Date(decoded.iat * 1000).toISOString(),
        expiresAt: new Date(decoded.exp * 1000).toISOString(),
        timeToExpiry: `${Math.floor(timeToExpiry / 86400)} days ${Math.floor((timeToExpiry % 86400) / 3600)} hours`,
        timeToExpirySeconds: timeToExpiry,
        isExpired: timeToExpiry <= 0,
        redisTTL: redisTtl,
        redisTTLHuman: `${Math.floor(redisTtl / 86400)} days ${Math.floor((redisTtl % 86400) / 3600)} hours`,
      };
      
      console.log('📦 Token status:', result);
      return result;
    } catch (error) {
      console.error('❌ Error decoding token:', error.message);
      return {
        exists: true,
        isValid: false,
        error: error.message,
        redisTTL: redisTtl,
      };
    }
  }

  /**
   * Force logout - invalidate refresh token
   */
  async forceLogout(userId: string): Promise<{ message: string }> {
    console.log(`\n🚪 [LOGOUT] Force logout for user: ${userId}`);
    
    const redisKey = `refresh_token_${userId}`;
    await this.redisService.delete(redisKey);
    
    const verifyDelete = await this.redisService.get(redisKey);
    const success = !verifyDelete;
    
    console.log(`✅ Logout ${success ? 'successful' : 'failed'}`);
    return { 
      message: success ? 'Logout successful' : 'Logout failed - token not found' 
    };
  }

  /**
   * Get token info without verification
   */
  getTokenInfo(token: string): any {
    try {
      const decoded = this.jwtService.decode(token);
      if (!decoded) {
        return { error: 'Invalid token' };
      }
      
      const now = Math.floor(Date.now() / 1000);
      const isExpired = decoded.exp ? decoded.exp < now : false;
      const timeToExpiry = decoded.exp ? decoded.exp - now : 0;
      
      return {
        isValid: true,
        userId: decoded.user_id,
        roleId: decoded.roleId,
        tokenType: decoded.tokenType,
        issuedAt: new Date(decoded.iat * 1000).toISOString(),
        expiresAt: new Date(decoded.exp * 1000).toISOString(),
        isExpired: isExpired,
        timeToExpiry: isExpired ? 'Expired' : `${Math.floor(timeToExpiry / 86400)} days ${Math.floor((timeToExpiry % 86400) / 3600)} hours`,
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}