import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class States {
  @Field(() => ID)
  _id: string; // GraphQL exposes string, DB stores ObjectId

  @Field(() => Int)
  @Prop({ required: true })
  stateCode: number;

  @Field()
  @Prop({ required: true })
  stateName: string;

  @Field()
  @Prop({ required: true })
  stateOrUt: string; // "U" or "S"
}

export type StateDocument = HydratedDocument<States>;
export const StateSchema = SchemaFactory.createForClass(States);
