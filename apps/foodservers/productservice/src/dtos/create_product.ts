import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProductDto {
  // 🔹 Basic Info
  
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  price: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  stock?: number;

  // 🔹 Category Info
  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(['VEG', 'NON_VEG', 'VEGAN'])
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(['STARTER', 'MAIN_COURSE', 'DESSERT', 'DRINK'])
  type?: string;

  // 🔹 Restaurant Link
  @Field()
  @IsString()
  restaurantId: string;

  // 🔹 Media
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  // 🔹 Status
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;

  // 🔹 Meta Info
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
