import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Product {
  @Field(() => ID)
  declare readonly _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  stock?: number;

  @Prop({ enum: ['VEG', 'NON_VEG', 'VEGAN'], default: 'VEG' })
  category?: string;

  @Prop({ enum: ['STARTER', 'MAIN_COURSE', 'DESSERT', 'DRINK'], default: 'MAIN_COURSE' })
  type?: string;

  @Prop({ required: true, type: String, ref: 'Restaurant' })
  restaurantId: string;

  @Prop()
  imageUrl?: string;

  @Prop({ default: true })
  isAvailable?: boolean;

  @Prop({ default: false })
  isRecommended?: boolean;

  @Prop()
  createdBy?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
