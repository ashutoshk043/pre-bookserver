import { InputType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { RestaurantInput } from './restaurant.input';

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  confirmPassword?: string

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  district?: string;

  @Field({ nullable: true })
  block?: string;

  @Field({ nullable: true })
  village?: string;

  @Field({ nullable: true })
  roleId?: string;

  @Field({ nullable: true })
  profile?: string;

  @Field({ nullable: true })
  status?: string;

  /**
   * ✅ permissions: module-wise CRUD actions
   * Example:
   * {
   *   users: ['c', 'r', 'u', 'd'],
   *   orders: ['r', 'u'],
   *   products: ['c', 'r', 'u', 'd']
   * }
   */
  @Field(() => GraphQLJSONObject, { nullable: true })
  permissions?: Record<string, string[]>;

  /**
   * ✅ createdBy: ID of the user/admin who created this user
   */
  @Field(() => ID, { nullable: true })
  createdBy?: string;

  @Field(() => RestaurantInput, { nullable: true })
  restaurant?: RestaurantInput; // ✅ Optional
}
