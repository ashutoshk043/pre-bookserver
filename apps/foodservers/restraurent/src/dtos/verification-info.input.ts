import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class VerificationInfoInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  role?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date) // ✅ ensures string is converted to Date type
  @IsDate()
  verifiedAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  remarks?: string;
}
