import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()  // ✅ GraphQL output ke liye
export class restProfileDTO {
  @Field(() => String)
  userId: string;

  @Field(() => String, { nullable: true })
  restaurantName?: string;

  @Field(() => String)
  restaurantType: string;

  @Field(() => String)
  restaurantAddress: string;

  @Field(() => String)
  pincode: string;

  @Field(() => String, { nullable: true })
  latitude?: string;

  @Field(() => String, { nullable: true })
  longitude?: string;

  @Field(() => String, { nullable: true })
  fssaiNumber?: string;

  @Field(() => String, { nullable: true })
  gstNumber?: string;

  @Field(() => String, { nullable: true })
  panNumber?: string;

  @Field(() => String, { nullable: true })
  registrationDate?: string;

  @Field(() => String, { nullable: true })
  openingTime?: string;

  @Field(() => String, { nullable: true })
  closingTime?: string;

  @Field(() => String, { nullable: true })
  logoUrl?: string;

  @Field(() => Date, { nullable: true })
  coverImageUrl?: Date;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean, { nullable: true })
  isVerified?: boolean;
}

export { restProfileDTO as default };
