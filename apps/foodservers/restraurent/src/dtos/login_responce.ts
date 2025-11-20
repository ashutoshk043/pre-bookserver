import { ObjectType, Field } from '@nestjs/graphql';
import { restProfileDTO } from '../dtos/rest_profile_responce';

@ObjectType()
export class RestaurantLoginResponse {
  @Field()
  token: string;

  @Field(() => restProfileDTO)
  restaurantProfile: restProfileDTO

}
