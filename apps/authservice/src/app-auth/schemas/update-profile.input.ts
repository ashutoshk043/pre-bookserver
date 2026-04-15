import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @Field()
  @IsString()
  fullName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsDateString()
  dateOfBirth: string;

  @Field()
  @IsEnum(['male', 'female', 'other'])
  gender: string;
}