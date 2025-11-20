import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class Restaurant_details {

  @Field({nullable:true})
  @Prop()
  userId?:string

  @Field({ nullable: true })
  @Prop()
  restaurantName?: string;

  @Field({ nullable: true })
  @Prop()
  restaurantType?: string;

  @Field({ nullable: true })
  @Prop()
  restaurantAddress?: string;

  @Field({ nullable: true })
  @Prop()
  pincode?: string;

  @Field({ nullable: true })
  @Prop()
  latitude?: string;

  @Field({ nullable: true })
  @Prop()
  longitude?: string;

  @Field({ nullable: true })
  @Prop()
  fssaiNumber?: string;

  @Field({ nullable: true })
  @Prop()
  gstNumber?: string;

  @Field({ nullable: true })
  @Prop()
  panNumber?: string;

  @Field({ nullable: true })
  @Prop()
  registrationDate?: string;

  @Field({ nullable: true })
  @Prop()
  openingTime?: string;

  @Field({ nullable: true })
  @Prop()
  closingTime?: string;

  @Field({ nullable: true })
  @Prop()
  logoUrl?: string;

  @Field({ nullable: true })
  @Prop()
  coverImageUrl?: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field({ nullable: true })
  @Prop({ default: false })
  isVerified?: boolean;
}

export const Restaurant_detailsSchema = SchemaFactory.createForClass(Restaurant_details);

