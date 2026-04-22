/**
 * zone.types.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * GraphQL ObjectType declarations for the Zone module.
 *
 * Every @Field property uses the `!` definite-assignment assertion.
 * These classes are never instantiated with `new` — NestJS/GraphQL
 * uses them purely as schema descriptors, and Apollo populates the
 * fields at runtime from resolver return values.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

// ─── GeoJSON sub-types ────────────────────────────────────────────────────────

@ObjectType({ description: 'GeoJSON Point — [longitude, latitude]' })
export class GeoPointType {
  @Field()
  type!: string;                   // Always "Point"

  @Field(() => [Float])
  coordinates!: [number, number];  // [lng, lat]
}

@ObjectType({ description: 'GeoJSON Polygon — array of coordinate rings' })
export class GeoPolygonType {
  @Field()
  type!: string;                   // Always "Polygon"

  /**
   * [[[Float]]] — first ring is the outer boundary.
   * Each ring must close (first position === last position).
   */
  @Field(() => [[[Float]]])
  coordinates!: number[][][];
}

// ─── Configuration sub-types ──────────────────────────────────────────────────

@ObjectType({ description: 'Live service state for the zone' })
export class ZoneServiceType {
  @Field()
  isActive!: boolean;

  @Field(() => Int, { description: '1 = highest priority' })
  priority!: number;

  @Field(() => Int)
  maxOrders!: number;

  @Field(() => Int, { description: 'Real-time counter updated by Order Service' })
  currentOrders!: number;
}

@ObjectType({ description: 'Feature flags controlling available delivery options' })
export class ZoneFeaturesType {
  @Field()
  codAvailable!: boolean;

  @Field()
  expressDelivery!: boolean;

  @Field()
  scheduledDelivery!: boolean;
}

@ObjectType({ description: 'Fare calculation parameters' })
export class ZonePricingType {
  @Field(() => Float, { description: 'Fixed base fare in ₹' })
  baseFare!: number;

  @Field(() => Float, { description: 'Per-km charge in ₹' })
  perKm!: number;

  @Field(() => Float, { description: 'Surge multiplier; 1.0 = no surge' })
  surgeMultiplier!: number;
}

@ObjectType({ description: 'Daily operating hours for the zone' })
export class ZoneTimingsType {
  @Field({ description: 'Opening time in HH:MM (24-hour)' })
  open!: string;

  @Field({ description: 'Closing time in HH:MM (24-hour)' })
  close!: string;

  @Field({ description: 'When true, zone never closes; open/close are ignored' })
  is24x7!: boolean;
}

// ─── Root Zone type ───────────────────────────────────────────────────────────

@ObjectType('Zone', { description: 'A delivery zone with geographic boundary and configuration' })
export class ZoneType {
  @Field(() => ID)
  _id!: string;

  @Field({ description: 'Human-readable zone name' })
  name!: string;

  @Field({ description: 'URL-safe unique identifier' })
  slug!: string;

  @Field({ description: 'ObjectId of the parent District' })
  districtId!: string;

  @Field(() => GeoPointType)
  center!: GeoPointType;

  @Field(() => GeoPolygonType, { nullable: true })
  polygon?: GeoPolygonType;        // optional — ? already covers undefined, no ! needed

  @Field(() => ZoneServiceType)
  service!: ZoneServiceType;

  @Field(() => ZoneFeaturesType)
  features!: ZoneFeaturesType;

  @Field(() => ZonePricingType)
  pricing!: ZonePricingType;

  @Field(() => ZoneTimingsType)
  timings!: ZoneTimingsType;

  @Field({ description: 'ISO-8601 creation timestamp' })
  createdAt!: Date;

  @Field({ nullable: true })
  updatedAt?: Date;                // optional — ? already covers undefined, no ! needed
}

// ─── Paginated response wrapper ───────────────────────────────────────────────

@ObjectType({ description: 'Paginated list of zones' })
export class ZonePage {
  @Field(() => [ZoneType])
  data!: ZoneType[];

  @Field(() => Int, { description: 'Total documents across all pages' })
  total!: number;

  @Field(() => Int, { description: 'Current 1-indexed page number' })
  page!: number;

  @Field(() => Int, { description: 'Items per page' })
  limit!: number;

  @Field(() => Int, { description: 'Math.ceil(total / limit)' })
  totalPages!: number;
}