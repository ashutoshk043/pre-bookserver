import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@ObjectType()
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

@ObjectType()
@Schema({ timestamps: true })
export class Restaurant extends Document {
  @Field(() => ID)
  declare readonly _id: string;

  // 🔹 Basic Information
  @Field()
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  ownerName: string;

  @Field()
  @Prop({ required: true, enum: ['RESTAURANT', 'CLOUD_KITCHEN', 'CART'] })
  type: string;

  // 🔹 Contact Details
  @Field({ nullable: true })
  @Prop()
  phone: string;

  @Field({ nullable: true })
  @Prop()
  email: string;

  @Field({ nullable: true })
  @Prop()
  password: string;

  // 🔹 Location Details
  @Field({ nullable: true })
  @Prop()
  address: string;

  @Field({ nullable: true })
  @Prop()
  city: string;

  @Field({ nullable: true })
  @Prop()
  state: string;

  @Field({ nullable: true })
  @Prop()
  pincode: string;

  @Field({ nullable: true })
  @Prop()
  latitude: string;

  @Field({ nullable: true })
  @Prop()
  longitude: string;

  // 🔹 Legal & Verification Info
  @Field({ nullable: true })
  @Prop()
  fssaiNumber: string;

  @Field({ nullable: true })
  @Prop()
  gstNumber: string;

  @Field({ nullable: true })
  @Prop()
  panNumber: string;

  // 🔹 Business Info
  @Field({ nullable: true })
  @Prop()
  registrationDate: Date;

  @Field({ nullable: true })
  @Prop()
  openingTime: string;

  @Field({ nullable: true })
  @Prop()
  closingTime: string;

  @Field({ nullable: true })
  @Prop()
  isOpen: boolean;

  @Field({ nullable: true })
  @Prop()
  rating: number;

  @Field({ nullable: true })
  @Prop()
  totalOrders: number;

  // 🔹 Images & Branding
  @Field({ nullable: true })
  @Prop()
  logoUrl: string;

  @Field({ nullable: true })
  @Prop()
  coverImageUrl: string;

  // 🔹 Misc
  @Field({ nullable: true })
  @Prop()
  description: string;

  @Field({ nullable: true })
  @Prop()
  isVerified: boolean;

  @Field({ nullable: true })
  @Prop()
  createdBy: string;

  // 🔹 Verification Details
  @Field(() => VerificationInfo, { nullable: true })
  @Prop({ type: Object })
  verifiedBy?: VerificationInfo;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}



export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
