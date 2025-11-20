import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()  // ✅ GraphQL output ke liye
export class restProfileDTO {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  ownerName?: string;

  @Field(() => String)
  type: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  pincode?: string;

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

  @Field(() => Date, { nullable: true })
  registrationDate?: Date;

  @Field(() => String, { nullable: true })
  openingTime?: string;

  @Field(() => String, { nullable: true })
  closingTime?: string;

  @Field(() => Boolean, { nullable: true })
  isOpen?: boolean;

  @Field(() => Number, { nullable: true })
  rating?: number;

  @Field(() => Number, { nullable: true })
  totalOrders?: number;

  @Field(() => String, { nullable: true })
  logoUrl?: string;

  @Field(() => String, { nullable: true })
  coverImageUrl?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean, { nullable: true })
  isVerified?: boolean;
}

export { restProfileDTO as default };
