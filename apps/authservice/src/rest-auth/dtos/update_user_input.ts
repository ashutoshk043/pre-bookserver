import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { RestaurantInput } from './restaurant.input';
import { CreateUserInput } from './create_user_input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  // 🔥 Required for update
  @Field(() => ID)
  id!: string;

  // ❗ DO NOT re-declare password here
  // password & confirmPassword already inherited from CreateUserInput

  // Additional fields (optional)
  //   @Field(() => GraphQLJSONObject, { nullable: true })
  //   permissions?: Record<string, string[]>;

  //   @Field(() => RestaurantInput, { nullable: true })
  //   restaurant?: RestaurantInput;
}
