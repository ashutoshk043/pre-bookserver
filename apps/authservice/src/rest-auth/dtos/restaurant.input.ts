import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RestaurantInput {
  @Field()
  restaurantName: string;

  @Field()
  restaurantType: string;

  @Field()
  restaurantAddress: string;

  @Field()
  pincode: string;

  @Field()
  latitude: string;

  @Field()
  longitude: string;

  @Field()
  fssaiNumber: string;

  @Field()
  gstNumber: string;

  @Field()
  panNumber: string;

  @Field()
  registrationDate: string;

  @Field()
  openingTime: string;

  @Field()
  closingTime: string;

  // ❌ These 3 are optional
  @Field({ nullable: true })
  logoUrl?: string;

  @Field({ nullable: true })
  coverImageUrl?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  isVerified: boolean;
}
