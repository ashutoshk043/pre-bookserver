/**
 * zone.input.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * GraphQL InputType declarations consumed by the CREATE and UPDATE mutations.
 * Every @Field property uses `!` (definite-assignment assertion) because
 * NestJS/Apollo populates these at runtime — they are never constructed with
 * `new` by application code.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ─── GeoJSON inputs ───────────────────────────────────────────────────────────

@InputType({ description: 'GeoJSON Point input — [longitude, latitude]' })
export class GeoPointInput {
  @Field({ defaultValue: 'Point' })
  @IsString()
  @IsIn(['Point'])
  type!: string;

  @Field(() => [Float])
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates!: [number, number];
}

@InputType({ description: 'GeoJSON Polygon input — array of coordinate rings' })
export class GeoPolygonInput {
  @Field({ defaultValue: 'Polygon' })
  @IsString()
  @IsIn(['Polygon'])
  type!: string;

  @Field(() => [[[Float]]])
  @IsArray()
  coordinates!: number[][][];
}

// ─── Configuration inputs ─────────────────────────────────────────────────────

@InputType()
export class ZoneServiceInput {
  @Field({ defaultValue: true })
  @IsBoolean()
  isActive!: boolean;

  @Field(() => Int, { defaultValue: 1, description: '1 = highest priority' })
  @IsNumber()
  @Min(1)
  @Max(10)
  priority!: number;

  @Field(() => Int, { defaultValue: 100 })
  @IsNumber()
  @Min(1)
  maxOrders!: number;

  // currentOrders is intentionally excluded — managed only by the Order Service
}

@InputType()
export class ZoneFeaturesInput {
  @Field({ defaultValue: false })
  @IsBoolean()
  codAvailable!: boolean;

  @Field({ defaultValue: false })
  @IsBoolean()
  expressDelivery!: boolean;

  @Field({ defaultValue: false })
  @IsBoolean()
  scheduledDelivery!: boolean;
}

@InputType()
export class ZonePricingInput {
  @Field(() => Float, { defaultValue: 20, description: 'Base fare in ₹' })
  @IsNumber()
  @Min(0)
  baseFare!: number;

  @Field(() => Float, { defaultValue: 5, description: 'Per-km charge in ₹' })
  @IsNumber()
  @Min(0)
  perKm!: number;

  @Field(() => Float, { defaultValue: 1.0, description: '1.0 = no surge' })
  @IsNumber()
  @Min(1)
  surgeMultiplier!: number;
}

@InputType()
export class ZoneTimingsInput {
  @Field({ defaultValue: '08:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'open must be HH:MM (24-hour)' })
  open!: string;

  @Field({ defaultValue: '22:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'close must be HH:MM (24-hour)' })
  close!: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  is24x7!: boolean;
}

// ─── Root ZoneInput ───────────────────────────────────────────────────────────

@InputType({ description: 'Payload for creating or updating a zone' })
export class ZoneInput {

  // ── Identity ───────────────────────────────────────────────────────────────

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  /**
   * Optional — auto-generated from name on create if omitted.
   * Must be lowercase alphanumeric + hyphens only.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug may only contain lowercase letters, numbers and hyphens' })
  slug?: string;

  @Field({ description: 'MongoDB ObjectId of the parent District' })
  @IsString()
  @IsNotEmpty()
  districtId!: string;

  // ── Geography ──────────────────────────────────────────────────────────────

  @Field(() => GeoPointInput)
  @ValidateNested()
  @Type(() => GeoPointInput)
  center!: GeoPointInput;

  @Field(() => GeoPolygonInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoPolygonInput)
  polygon?: GeoPolygonInput;

  // ── Configuration ──────────────────────────────────────────────────────────

  @Field(() => ZoneServiceInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ZoneServiceInput)
  service?: ZoneServiceInput;

  @Field(() => ZoneFeaturesInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ZoneFeaturesInput)
  features?: ZoneFeaturesInput;

  @Field(() => ZonePricingInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ZonePricingInput)
  pricing?: ZonePricingInput;

  @Field(() => ZoneTimingsInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ZoneTimingsInput)
  timings?: ZoneTimingsInput;
}

// ─── Filter / Search DTO (internal — not a GraphQL input) ────────────────────

export class ZoneFilterDto {
  page:        number  = 1;
  limit:       number  = 10;
  search?:     string;
  isActive?:   boolean;
  districtId?: string;
}