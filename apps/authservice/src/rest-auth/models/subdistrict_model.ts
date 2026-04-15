import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class SubDistricts {
  @Field(() => ID)
  _id: string; // GraphQL → string, MongoDB → ObjectId

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

  @Field(() => Int)
  @Prop({ required: true })
  subDistrictCode: number;

  @Field()
  @Prop({ required: true })
  subDistrictName: string;
}

export type SubDistrictDocument = HydratedDocument<SubDistricts>;
export const SubDistrictSchema = SchemaFactory.createForClass(SubDistricts);
