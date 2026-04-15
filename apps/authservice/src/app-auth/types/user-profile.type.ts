// types/user-profile.type.ts

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
class AddressType {
  @Field(() => ID)
  _id: string;

  @Field()
  label: string;

  @Field()
  addressLine1: string;

  @Field({ nullable: true })
  addressLine2?: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  pincode: string;

  @Field({ nullable: true })
  landmarkDetails?: string;

  @Field()
  isDefault: boolean;
}

@ObjectType()
export class UserProfileResponse {
  @Field(() => ID)
  _id: string;

  @Field()
  mobile: string;

  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  isMobileVerified: boolean;

  @Field({nullable:true})
  gender:string;

  @Field({nullable:true})
  dateOfBirth:Date;

  @Field()
  isProfileCompleted: boolean;

  @Field(() => [AddressType])
  addresses: AddressType[];

  @Field(() => Number, { nullable: true })
rewardPoints?: number;

@Field(() => Number, { nullable: true })
walletBalance?: number;

@Field(() => Number, { nullable: true })
totalOrders?: number;

@Field(() => Number, { nullable: true })
totalSpent?: number;

@Field(() => [String], { nullable: true })
roles?: string[];

@Field({ nullable: true })
preferredLanguage?: string;

@Field({ nullable: true })
referralCode?: string;

@Field({ nullable: true })
createdAt?: string;
}