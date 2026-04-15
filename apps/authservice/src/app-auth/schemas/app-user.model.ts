import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppUserDocument = AppUser & Document;

@Schema({ timestamps: true, collection: 'app_users' })
export class AppUser {
  // 🔐 LOGIN
  @Prop({ required: true, unique: true, index: true })
  mobile: string;

  @Prop()
  countryCode: string;

  @Prop({ default: false })
  isMobileVerified: boolean;

@Prop({ default: false })
isProfileCompleted: boolean;

  // 👤 PROFILE
  @Prop()
  fullName?: string;

  @Prop({ unique: true, sparse: true })
  email?: string;

  @Prop()
  avatarUrl?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ enum: ['male', 'female', 'other'] })
  gender?: string;

  // 🔑 AUTH
  @Prop()
  refreshToken?: string; // (Better: store hash in separate collection)

  @Prop({ type: [String], default: [] })
  fcmTokens?: string[];

  // 👥 ROLES
  @Prop({
    type: [String],
    enum: ['customer', 'vendor', 'delivery', 'admin'],
    default: ['customer'],
  })
  roles: string[];

  // 💰 WALLET
  @Prop({ default: 0 })
  walletBalance: number;

  // 🎁 REFERRAL SYSTEM
  @Prop({ unique: true, sparse: true })
  referralCode?: string;

  @Prop({ type: Types.ObjectId, ref: 'AppUser' })
  referredBy?: Types.ObjectId;

  // 🌍 SETTINGS
  @Prop({ default: 'en' })
  preferredLanguage: string;

  // 📍 DEFAULT ADDRESS REFERENCE
  @Prop({ type: Types.ObjectId, ref: 'UserAddress' })
  defaultAddressId?: Types.ObjectId;

  // 📊 STATUS
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isBlocked: boolean;

  // 🎯 ANALYTICS / GROWTH (VERY IMPORTANT FOR FUTURE)
  @Prop({ default: 0 })
  totalOrders: number;

  @Prop({ default: 0 })
  totalSpent: number;

  @Prop({ default: 0 })
  rewardPoints: number;
}

export const AppUserSchema = SchemaFactory.createForClass(AppUser);

// 🔥 INDEXES (IMPORTANT FOR SCALE)
AppUserSchema.index({ mobile: 1 });
AppUserSchema.index({ email: 1 });
AppUserSchema.index({ referralCode: 1 });