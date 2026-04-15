import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SendOtpInput {

  // 📱 User mobile number (without country code or with, based on your design)
  @Field()
  mobile: string;

  // 🌍 Country code (important for scaling outside India)
  // Example: +91
  @Field({ nullable: true })
  countryCode?: string;

  // 📱 Device info (VERY IMPORTANT for security & analytics)
  @Field({ nullable: true })
  deviceId?: string;

  @Field({ nullable: true })
  deviceType?: string; // android / ios / web

  // 🌐 IP address (for rate limiting / fraud detection)
  @Field({ nullable: true })
  ipAddress?: string;
}