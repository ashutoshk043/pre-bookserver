import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ZoneDocument = Zone & Document;

@Schema({
  timestamps: true,
  collection: 'zones',
  versionKey: false,
})
export class Zone {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug!: string;

  @Prop({ type: Types.ObjectId, ref: 'District', required: true })
  districtId!: string;

  // ✅ GEO POINT (CORRECT)
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: [Number],
  })
  center!: {
    type: 'Point';
    coordinates: [number, number];
  };

  // ✅ POLYGON (CORRECT)
  @Prop({
    type: {
      type: String,
      enum: ['Polygon'],
      default: 'Polygon',
    },
    coordinates: [[[Number]]],
  })
  polygon?: {
    type: 'Polygon';
    coordinates: number[][][];
  };

  // SIMPLE OBJECTS (safe version)
  @Prop({
    type: {
      isActive: { type: Boolean, default: true },
      priority: { type: Number, default: 1 },
      maxOrders: { type: Number, default: 100 },
      currentOrders: { type: Number, default: 0 },
    },
    default: {},
  })
  service!: {
    isActive: boolean;
    priority: number;
    maxOrders: number;
    currentOrders: number;
  };

  @Prop({
    type: {
      codAvailable: { type: Boolean, default: false },
      expressDelivery: { type: Boolean, default: false },
      scheduledDelivery: { type: Boolean, default: false },
    },
    default: {},
  })
  features!: {
    codAvailable: boolean;
    expressDelivery: boolean;
    scheduledDelivery: boolean;
  };

  @Prop({
    type: {
      baseFare: { type: Number, default: 20 },
      perKm: { type: Number, default: 5 },
      surgeMultiplier: { type: Number, default: 1 },
    },
    default: {},
  })
  pricing!: {
    baseFare: number;
    perKm: number;
    surgeMultiplier: number;
  };

  @Prop({
    type: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '22:00' },
      is24x7: { type: Boolean, default: false },
    },
    default: {},
  })
  timings!: {
    open: string;
    close: string;
    is24x7: boolean;
  };

  createdAt!: Date;
  updatedAt!: Date;
}

export const ZoneSchema = SchemaFactory.createForClass(Zone);

// ✅ INDEXES (ONLY HERE)
ZoneSchema.index({ name: 'text', slug: 'text' });
ZoneSchema.index({ 'service.isActive': 1, 'service.priority': 1 });
ZoneSchema.index({ center: '2dsphere' });
ZoneSchema.index({ polygon: '2dsphere' });