import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@ObjectType()
@Schema({ timestamps: true })
export class States extends Document {

  @Field(() => ID)
  declare readonly _id: string;  // Always string in GraphQL

  @Field(() => Int)
  @Prop({ required: true })
  stateCode: number;

  @Field()
  @Prop({ required: true })
  stateName: string;

  @Field()
  @Prop({ required: true })
  stateOrUt: string;   // "U" or "S"
}

export const StateSchema = SchemaFactory.createForClass(States);
