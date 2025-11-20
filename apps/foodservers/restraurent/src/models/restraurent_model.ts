import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema({ _id: false }) // ✅ No separate _id for subdocument
export class VerificationInfo {
  @Field({ nullable: true })
  @Prop()
  userId?: string;

  @Field({ nullable: true })
  @Prop()
  role?: string; // e.g., ADMIN, STATE_MANAGER

  @Field({ nullable: true })
  @Prop()
  verifiedAt?: Date;

  @Field({ nullable: true })
  @Prop()
  remarks?: string;
}

export const VerificationInfoSchema = SchemaFactory.createForClass(VerificationInfo);

@ObjectType()
@Schema({ timestamps: true }) // ✅ Auto adds createdAt and updatedAt
export class Restaurant extends Document {
  @Field(() => ID)
  declare readonly _id: string;

  // 🔹 Basic Information
  @Field()
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  ownerName?: string;

  @Field()
  @Prop({ required: true, enum: ['restraurent', 'cloud_kitchen', 'cart', 'cafe'] })
  type: string;

  // 🔹 Contact Details
  @Field({ nullable: true })
  @Prop({ unique: true, sparse: true }) // ✅ Allow unique but nullable
  email?: string;

  @Field({ nullable: true })
  @Prop()
  phone?: string;

  @Field({ nullable: true })
  @Prop()
  password?: string;

  // 🔹 Location Details
  @Field({ nullable: true })
  @Prop()
  address?: string;

  @Field({ nullable: true })
  @Prop()
  city?: string;

  @Field({ nullable: true })
  @Prop()
  state?: string;

  @Field({ nullable: true })
  @Prop()
  pincode?: string;

  @Field({ nullable: true })
  @Prop()
  latitude?: string;

  @Field({ nullable: true })
  @Prop()
  longitude?: string;

  // 🔹 Legal & Verification Info
  @Field({ nullable: true })
  @Prop()
  fssaiNumber?: string;

  @Field({ nullable: true })
  @Prop()
  gstNumber?: string;

  @Field({ nullable: true })
  @Prop()
  panNumber?: string;

  // 🔹 Business Info
  @Field({ nullable: true })
  @Prop()
  registrationDate?: Date;

  @Field({ nullable: true })
  @Prop()
  openingTime?: string;

  @Field({ nullable: true })
  @Prop()
  closingTime?: string;

  @Field({ nullable: true })
  @Prop({ default: false })
  isOpen?: boolean;

  @Field({ nullable: true })
  @Prop({ default: 0 })
  rating?: number;

  @Field({ nullable: true })
  @Prop({ default: 0 })
  totalOrders?: number;

  // 🔹 Images & Branding
  @Field({ nullable: true })
  @Prop()
  logoUrl?: string;

  @Field({ nullable: true })
  @Prop()
  coverImageUrl?: string;

  // 🔹 Misc
  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field({ nullable: true })
  @Prop({ default: false })
  isVerified?: boolean;

  @Field({ nullable: true })
  @Prop()
  createdBy?: string;

  // 🔹 Verification Details (Subdocument)
  @Field(() => VerificationInfo, { nullable: true })
  @Prop({ type: VerificationInfoSchema })
  verifiedBy?: VerificationInfo;

  // 🔹 Timestamps
  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

// ✅ Create combined unique index for name + city
RestaurantSchema.index({ name: 1, city: 1 }, { unique: true });
