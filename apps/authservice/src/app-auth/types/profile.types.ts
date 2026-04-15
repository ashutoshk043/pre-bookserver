import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UpdateProfileResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}