import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsUrl,
} from 'class-validator';

@InputType()
export class UpdateRestaurantDto {
  // Basic Information
  @Field({ nullable: true })
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  ownerName?: string;

  @Field({ nullable: true })
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
  phone?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;

  // Location
  @Field({ nullable: true })
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsString()
  state?: string;

  @Field({ nullable: true })
  @Matches(/^[0-9]{6}$/, { message: 'Pincode must be 6 digits' })
  pincode?: string;

  @Field({ nullable: true })
  @IsString()
  latitude?: string;

  @Field({ nullable: true })
  @IsString()
  longitude?: string;

  // Legal
  @Field({ nullable: true })
  @IsString()
  fssaiNumber?: string;

  @Field({ nullable: true })
  @IsString()
  gstNumber?: string;

  @Field({ nullable: true })
  @IsString()
  panNumber?: string;

  @Field({ nullable: true })
  @IsString()
  registrationDate?: string;

  // Operating Hours
  @Field({ nullable: true })
  @IsString()
  openingTime?: string;

  @Field({ nullable: true })
  @IsString()
  closingTime?: string;

  // Media & Additional
  @Field({ nullable: true })
  @IsUrl({}, { message: 'Invalid logo URL' })
  logoUrl?: string;

  @Field({ nullable: true })
  @IsUrl({}, { message: 'Invalid cover image URL' })
  coverImageUrl?: string;

  @Field({ nullable: true })
  @IsBoolean()
  isVerified?: boolean;
}
