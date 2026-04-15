import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class Districts {
  @Field(() => ID)
  _id: string; // GraphQL exposes as string

  @Field(() => Int)
  @Prop({ required: true })
  stateCode: number;

  @Field()
  @Prop({ required: true })
  stateName: string;

  @Field(() => Int)
  @Prop({ required: true })
  districtCode: number;

  @Field()
  @Prop({ required: true })
  districtName: string;
}

export type DistrictDocument = HydratedDocument<Districts>;
export const DistrictSchema = SchemaFactory.createForClass(Districts);
