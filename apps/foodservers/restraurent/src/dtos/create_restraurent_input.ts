import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateRestaurantDto {
  // 🔹 Basic Information
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ownerName?: string;

  @Field()
  @IsEnum(['RESTAURANT', 'CLOUD_KITCHEN', 'CART'])
  type: string;

  // 🔹 Contact Details
  @Field()
  @IsString()
  phone: string;

  @Field()
  @IsEmail()
  email: string;

  // 🔹 Authentication
  @Field()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Field()
  @IsString()
  confirmPassword: string;

  // 🔹 Location
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  state?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  pincode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  latitude?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  longitude?: string;

  // 🔹 Legal Info
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fssaiNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  panNumber?: string;

  // 🔹 Business Info
  @Field({ nullable: true })
  @IsOptional()
  registrationDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  openingTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  closingTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  totalOrders?: number;

  // 🔹 Images
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  // 🔹 Misc
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
