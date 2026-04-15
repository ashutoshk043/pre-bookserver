import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserAddressDocument = UserAddress & Document;

// ─── Contact Info Subdocument ──────────────────────────────────────────────
@Schema({ _id: false })
export class ContactInfo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, match: /^[0-9]{10}$/ })
  phone: string;
}

// ─── Location Coordinates Subdocument ─────────────────────────────────────
@Schema({ _id: false })
export class Location {
  @Prop({ required: true, type: Number })
  lat: number;

  @Prop({ required: true, type: Number })
  lng: number;
}

// ─── Main Address Schema ──────────────────────────────────────────────────
@Schema({ timestamps: true, collection: 'user_addresses' })
export class UserAddress {

  @Prop({ type: Types.ObjectId, ref: 'AppUser', required: true, index: true })
  userId: Types.ObjectId;

  // Home / Work / Other
  @Prop({ type: String, enum: ['home', 'work', 'other'], default: 'home' })
  label: string;

  // Flat no, building, street
  @Prop({ required: true })
  addressLine1: string;

  // Area, landmark nearby
  @Prop()
  addressLine2?: string;

  // Specific delivery instructions
  // e.g. "gaon ke last mein, ahirr toli"
  @Prop()
  landmark?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true, match: /^\d{6}$/ })
  pincode: string;

  @Prop({ default: false })
  isDefault: boolean;

  // NEW: Contact information (name and phone)
  @Prop({ type: ContactInfo, required: true, _id: false })
  contactInfo: ContactInfo;

  // NEW: Location coordinates from GPS/Map
  @Prop({ type: Location, _id: false })
  location?: Location;
}

export const UserAddressSchema = SchemaFactory.createForClass(UserAddress);

// Create indexes for better query performance
UserAddressSchema.index({ userId: 1 });
UserAddressSchema.index({ pincode: 1 });
UserAddressSchema.index({ userId: 1, isDefault: 1 }); // For finding default address quickly
UserAddressSchema.index({ 'location.coordinates': '2dsphere' }); // For geo-spatial queries