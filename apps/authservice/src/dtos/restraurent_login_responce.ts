import { Field, ObjectType } from "@nestjs/graphql";
import { userProfileResponce } from "./user_profile_responce";

@ObjectType()
export class RestaurantLoginResponse {

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => userProfileResponce, { nullable: true })
  userProfile?: userProfileResponce;
}

