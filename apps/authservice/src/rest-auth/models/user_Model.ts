import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Types, HydratedDocument } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  readonly _id!: Types.ObjectId;

  @Field({ nullable: true })
  @Prop()
  name?: string;

  @Field({ nullable: true })
  @Prop()
  email?: string;

  @Field({ nullable: true })
  @Prop()
  phone?: string;

  @Field({ nullable: true })
  @Prop()
  password?: string;

  @Field({ nullable: true })
  @Prop()
  state?: string;

  @Field({ nullable: true })
  @Prop()
  district?: string;

  @Field({ nullable: true })
  @Prop()
  block?: string;

  @Field({ nullable: true })
  @Prop()
  village?: string;

  @Field({ nullable: true })
  @Prop()
  roleId?: string;

  @Field({ nullable: true })
  @Prop()
  status?: string;

  @Field({ nullable: true })
  @Prop()
  profile?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Prop({ type: Object, default: {} })
  permissions?: Record<string, any>;

  @Field({ nullable: true })
  @Prop()
  createdBy?: string;

  // @Field(() => Restaurant_details, { nullable: true })
  // @Prop({ type: Restaurant_detailsSchema })
  // restaurant?: Restaurant_details;

  // ✅ NEW: MULTIPLE RESTAURANT IDS
  @Field(() => [String], { nullable: true })
  @Prop({ type: [String], default: [] })
  restaurantIds?: string[];
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
