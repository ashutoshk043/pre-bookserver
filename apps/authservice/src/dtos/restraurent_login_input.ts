import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class RestraurentLoginDTO {
  @Field()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Field({ nullable: true }) // ✅ Add this if captcha is optional in GraphQL
  @IsString()
  @IsOptional()
  captcha?: string; // ✅ Optional field should have "?"
}
