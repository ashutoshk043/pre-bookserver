import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@ObjectType()
@Schema({ timestamps: true })
export class SubDistricts extends Document {

  @Field(() => ID)
  declare readonly _id: string;

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

export const SubDistrictSchema = SchemaFactory.createForClass(SubDistricts);
