import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { VerificationInfoInput } from './verification-info.input';

@InputType()
export class UpdateRestaurantDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ownerName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(['RESTAURANT', 'CLOUD_KITCHEN', 'CART'])
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

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

  // 🔹 Verification Info
  @Field(() => VerificationInfoInput, { nullable: true })
  @IsOptional()
  verifiedBy?: VerificationInfoInput;
}
