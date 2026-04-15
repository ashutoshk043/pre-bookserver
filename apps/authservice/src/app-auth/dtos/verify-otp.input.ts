import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VerifyOtpInput {

  // 📱 Mobile number used for OTP
  @Field()
  mobile: string;

  // 🔐 OTP entered by user
  @Field()
  otp: string;

  // 📱 Device tracking (must match send OTP)
  @Field({ nullable: true })
  deviceId?: string;

  @Field({ nullable: true })
  deviceType?: string;

  // 🌐 IP for verification logging
  @Field({ nullable: true })
  ipAddress?: string;
}