import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GraphQLJSONObject } from "graphql-type-json";
import { Document, Types } from "mongoose";
import { Restaurant_details, Restaurant_detailsSchema } from "./restraurent_model"; 

@ObjectType()
@Schema({ timestamps: true })
export class User extends Document {
  @Field(() => ID)
   declare readonly _id: string;   // <-- Always return as STRING for GraphQL

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
  permissions?: Record<string, string[]>;

  @Field({ nullable: true })
  @Prop()
  createdBy?: string;

  // 👉 Embed Restaurant
  @Field(() => Restaurant_details, { nullable: true })
  @Prop({ type: Restaurant_detailsSchema })
  restaurant?: Restaurant_details;

  // 👉 restaurantId always string
  @Field({ nullable: true })
  @Prop({ type: String })
  restaurantId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
