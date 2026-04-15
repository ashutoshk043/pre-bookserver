import { InputType, Field, ObjectType, ID } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsBoolean, IsString, Matches, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// ─── Location Coordinates Input ────────────────────────────────────────────

@InputType()
export class LocationInput {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  lng: number;
}

// ─── Location Coordinates Response ─────────────────────────────────────────

@ObjectType()
export class LocationResponse {
  @Field(() => Number)
  lat: number;

  @Field(() => Number)
  lng: number;
}

// ─── Contact Info Input ───────────────────────────────────────────────────

@InputType()
export class ContactInfoInput {
  @Field()
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
  phone: string;
}

// ─── Contact Info Response ─────────────────────────────────────────────────

@ObjectType()
export class ContactInfoResponse {
  @Field()
  name: string;

  @Field()
  phone: string;
}

// ─── Address Input (Updated) ─────────────────────────────────────────────

@InputType()
export class AddressInput {
  @Field(() => String, { defaultValue: 'home' })
  @IsEnum(['home', 'work', 'other'])
  @IsOptional()
  label?: string;

  @Field()
  @IsNotEmpty({ message: 'Address Line 1 is required' })
  @IsString()
  addressLine1: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  landmark?: string;

  @Field()
  @IsNotEmpty({ message: 'City is required' })
  @IsString()
  city: string;

  @Field()
  @IsNotEmpty({ message: 'State is required' })
  @IsString()
  state: string;

  @Field()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'Pincode must be 6 digits' })
  pincode: string;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  // NEW: Contact information
  @Field(() => ContactInfoInput)
  @ValidateNested()
  @Type(() => ContactInfoInput)
  contactInfo: ContactInfoInput;

  // NEW: Location coordinates
  @Field(() => LocationInput, { nullable: true })
  @ValidateNested()
  @Type(() => LocationInput)
  @IsOptional()
  location?: LocationInput;
}

// ─── Address Response (Updated) ───────────────────────────────────────────

@ObjectType()
export class AddressResponse {
  @Field(() => ID)
  _id: string;

  @Field()
  label: string;

  @Field()
  addressLine1: string;

  @Field({ nullable: true })
  addressLine2?: string;

  @Field({ nullable: true })
  landmark?: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  pincode: string;

  @Field()
  isDefault: boolean;

  // NEW: Contact information
  @Field(() => ContactInfoResponse)
  contactInfo: ContactInfoResponse;

  // NEW: Location coordinates
  @Field(() => LocationResponse, { nullable: true })
  location?: LocationResponse;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

// ─── Delete result ─────────────────────────────────────────────────────────

@ObjectType()
export class MutationResult {
  @Field() success: boolean;
  @Field() message: string;
}

// ─── Optional: Address List Response with Pagination ───────────────────────

@ObjectType()
export class AddressListResponse {
  @Field(() => [AddressResponse])
  addresses: AddressResponse[];

  @Field(() => Number)
  totalCount: number;

  @Field(() => Boolean)
  hasMore: boolean;
}