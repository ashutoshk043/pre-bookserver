import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@ObjectType()
@Schema({ timestamps: true })
export class Villages extends Document {

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

  @Field(() => Int)
  @Prop({ required: true })
  villageCode: number;

  @Field()
  @Prop({ required: true })
  villageName: string;
}

export const VillageSchema = SchemaFactory.createForClass(Villages);
