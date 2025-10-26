import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class RestaurantLoginResponse {
  @Field()
  token: string;
}
