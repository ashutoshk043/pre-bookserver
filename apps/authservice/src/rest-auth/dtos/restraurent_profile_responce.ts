import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class restProfileDTO {
  @Field(() => String)
  userId!: string;

  @Field(() => String, { nullable: true })
  restaurantName?: string;

  @Field(() => String)
  restaurantType!: string;

  @Field(() => String)
  restaurantAddress!: string;

  @Field(() => String)
  pincode!: string;

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

  @Field(() => String, { nullable: true })
  coverImageUrl?: string;        // ✅ fixed: was Date, should be String

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean, { nullable: true })
  isVerified?: boolean;

  // ✅ Zone reference (stored as ObjectId, exposed as ID string)
  @Field(() => ID, { nullable: true })
  zone?: string;
}

export { restProfileDTO as default };