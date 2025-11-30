import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@ObjectType()
@Schema({ timestamps: true })
export class Districts extends Document {

  @Field(() => ID)
  declare readonly _id: string;

  @Field(() => Int)
  @Prop({ required: true })
  stateCode: number;   // Parent stateCode (35)

  @Field()
  @Prop({ required: true })
  stateName: string;   // Parent state name

  @Field(() => Int)
  @Prop({ required: true })
  districtCode: number;  // District code (603)

  @Field()
  @Prop({ required: true })
  districtName: string;  // District name (Nicobars)
}

export const DistrictSchema = SchemaFactory.createForClass(Districts);
