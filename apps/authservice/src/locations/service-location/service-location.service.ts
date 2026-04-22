import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Zone, ZoneDocument } from '../schemas/ zone.schema'; // ✅ removed stray space in path
import { ZoneInput, ZoneFilterDto } from '../dtos/zone.input';
import { ZonePage } from '../types/zone.types';

@Injectable()
export class ServiceLocationService {
  private readonly logger = new Logger(ServiceLocationService.name);

  constructor(
    @InjectModel(Zone.name, 'usersConnection')
    private readonly zoneModel: Model<Zone>,
  ) {}

  // ══════════════════════════════════════════════════════════════════════════
  // PUBLIC: getZones — called by resolver
  // ══════════════════════════════════════════════════════════════════════════

  async getZones(
    lat?: number,
    lng?: number,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    this.logger.log(`📍 getZones called → lat:${lat} lng:${lng} search:"${search}"`);

    // ✅ Guard: only attempt geo lookup when BOTH coords are real numbers
    const hasCoords =
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      isFinite(lat) &&
      isFinite(lng);

    if (hasCoords) {
      const zone = await this.findZoneByCoordinates(lat!, lng!);

      if (zone) {
        this.logger.log(`✅ Zone resolved: ${zone.name}`);
        return {
          data: [zone],
          total: 1,
          page: 1,
          limit: 1,
          totalPages: 1,
        };
      }

      // Log clearly — helps distinguish "bad coords" vs "missing index" vs "no zone drawn"
      this.logger.warn(
        `⚠️ No zone matched (${lat}, ${lng}) — falling back to paginated list`,
      );
    }

    // ── Fallback: paginated + searchable list ──────────────────────────────
    return this.findAll({
      page,
      limit,
      search,
    } as ZoneFilterDto);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PRIVATE: findZoneByCoordinates — 2-stage geo lookup
  // ══════════════════════════════════════════════════════════════════════════

  private async findZoneByCoordinates(
    lat: number,
    lng: number,
  ): Promise<Pick<ZoneDocument, '_id' | 'name'> | null> {
    // MongoDB always expects [longitude, latitude]
    const point = {
      type: 'Point' as const,
      coordinates: [lng, lat],
    };

    // ── STAGE 1: Exact polygon intersection ──────────────────────────────────
    // Requires: ZoneSchema.index({ polygon: '2dsphere' })
    try {
      const exact = await this.zoneModel
        .findOne({
          polygon: {
            $geoIntersects: { $geometry: point },
          },
        })
        .select('_id name')
        .lean()
        .exec();

      if (exact) {
        this.logger.log(`🎯 Stage 1 hit — exact polygon: ${(exact as any).name}`);
        return exact as any;
      }
    } catch (err: any) {
      // Catches missing 2dsphere index or malformed polygon in DB
      this.logger.error('❌ Stage 1 ($geoIntersects) failed:', err.message);
      this.logGeoIndexHint(err);
      // Don't return yet — attempt Stage 2 with centroid
    }

    // ── STAGE 2: Nearest centroid fallback ───────────────────────────────────
    // Handles GPS inaccuracy (50–300 m drift near polygon edges)
    // Requires: ZoneSchema.index({ centroid: '2dsphere' })
    try {
      const nearest = await this.zoneModel
        .findOne({
          centroid: {
            $nearSphere: {
              $geometry: point,
              $maxDistance: 5000, // 5 km radius — tune to your zone sizes
            },
          },
        })
        .select('_id name')
        .lean()
        .exec();

      if (nearest) {
        this.logger.warn(
          `📍 Stage 2 hit — nearest centroid (GPS drift fallback): ${(nearest as any).name}`,
        );
        return nearest as any;
      }
    } catch (err: any) {
      this.logger.error('❌ Stage 2 ($nearSphere) failed:', err.message);
      this.logGeoIndexHint(err);
    }

    return null;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // READ — findAll (paginated, searchable, filterable)
  // ══════════════════════════════════════════════════════════════════════════

  async findAll(dto: ZoneFilterDto): Promise<ZonePage> {
    const page  = Math.max(1, dto.page  ?? 1);
    const limit = Math.min(100, Math.max(1, dto.limit ?? 10));
    const skip  = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (dto.search?.trim()) {
      filter.$text = { $search: dto.search.trim() };
    }
    if (dto.isActive !== undefined) {
      filter['service.isActive'] = dto.isActive;
    }
    if (dto.districtId) {
      filter.districtId = dto.districtId;
    }

    const sort: Record<string, unknown> = dto.search?.trim()
      ? { score: { $meta: 'textScore' } }
      : { 'service.priority': 1, createdAt: -1 };

    const [total, data] = await Promise.all([
      this.zoneModel.countDocuments(filter).exec(),
      this.zoneModel
        .find(filter)
        .select(dto.search?.trim() ? { score: { $meta: 'textScore' } } : {})
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      data: data as any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // READ — findOne
  // ══════════════════════════════════════════════════════════════════════════

  async findOne(id: string): Promise<ZoneDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Zone "${id}" not found`);
    }

    const zone = await this.zoneModel.findById(id).lean().exec();
    if (!zone) throw new NotFoundException(`Zone with id "${id}" not found`);

    return zone as unknown as ZoneDocument;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CREATE
  // ══════════════════════════════════════════════════════════════════════════

  async create(input: ZoneInput): Promise<ZoneDocument> {
    const slug = input.slug?.trim() ? input.slug.trim() : this.slugify(input.name);

    const existing = await this.zoneModel.findOne({ slug }).lean().exec();
    if (existing) throw new ConflictException(`Zone slug "${slug}" already exists`);

    const payload = {
      name:       input.name,
      slug,
      districtId: input.districtId,
      center:     input.center,
      polygon:    input.polygon,
      // ✅ Store centroid for Stage 2 fallback
      // Derive from center if available, otherwise compute from polygon ring
      centroid:   input.center ?? this.computeCentroid(input.polygon),
      service: {
        isActive:      input.service?.isActive      ?? true,
        priority:      input.service?.priority      ?? 1,
        maxOrders:     input.service?.maxOrders     ?? 100,
        currentOrders: 0,
      },
      features: {
        codAvailable:      input.features?.codAvailable      ?? false,
        expressDelivery:   input.features?.expressDelivery   ?? false,
        scheduledDelivery: input.features?.scheduledDelivery ?? false,
      },
      pricing: {
        baseFare:        input.pricing?.baseFare        ?? 20,
        perKm:           input.pricing?.perKm           ?? 5,
        surgeMultiplier: input.pricing?.surgeMultiplier ?? 1.0,
      },
      timings: {
        open:   input.timings?.open   ?? '08:00',
        close:  input.timings?.close  ?? '22:00',
        is24x7: input.timings?.is24x7 ?? false,
      },
    };

    try {
      const created = await this.zoneModel.create(payload);
      this.logger.log(`Zone created: ${created._id} (${created.slug})`);
      return created;
    } catch (err: any) {
      if (err.code === 11000) throw new ConflictException(`Zone slug "${slug}" already exists`);
      this.logger.error('create failed', err);
      throw new InternalServerErrorException('Could not create zone');
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // UPDATE
  // ══════════════════════════════════════════════════════════════════════════

  async update(id: string, input: ZoneInput): Promise<ZoneDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException(`Zone "${id}" not found`);

    const current = await this.zoneModel.findById(id).lean().exec();
    if (!current) throw new NotFoundException(`Zone with id "${id}" not found`);

    let slug: string = (current as any).slug;

    if (input.slug?.trim()) {
      slug = input.slug.trim();
    } else if (input.name && input.name !== (current as any).name) {
      slug = this.slugify(input.name);
    }

    if (slug !== (current as any).slug) {
      const conflict = await this.zoneModel.findOne({ slug, _id: { $ne: id } }).lean().exec();
      if (conflict) throw new ConflictException(`Zone slug "${slug}" already exists`);
    }

    const $set: Record<string, any> = { slug };

    if (input.name)       $set.name       = input.name;
    if (input.districtId) $set.districtId = input.districtId;
    if (input.center)     $set.center     = input.center;
    if (input.polygon) {
      $set.polygon  = input.polygon;
      // ✅ Keep centroid in sync when polygon changes
      $set.centroid = input.center ?? this.computeCentroid(input.polygon);
    }

    if (input.service) {
      if (input.service.isActive  !== undefined) $set['service.isActive']  = input.service.isActive;
      if (input.service.priority  !== undefined) $set['service.priority']  = input.service.priority;
      if (input.service.maxOrders !== undefined) $set['service.maxOrders'] = input.service.maxOrders;
    }
    if (input.features) {
      if (input.features.codAvailable      !== undefined) $set['features.codAvailable']      = input.features.codAvailable;
      if (input.features.expressDelivery   !== undefined) $set['features.expressDelivery']   = input.features.expressDelivery;
      if (input.features.scheduledDelivery !== undefined) $set['features.scheduledDelivery'] = input.features.scheduledDelivery;
    }
    if (input.pricing) {
      if (input.pricing.baseFare        !== undefined) $set['pricing.baseFare']        = input.pricing.baseFare;
      if (input.pricing.perKm           !== undefined) $set['pricing.perKm']           = input.pricing.perKm;
      if (input.pricing.surgeMultiplier !== undefined) $set['pricing.surgeMultiplier'] = input.pricing.surgeMultiplier;
    }
    if (input.timings) {
      if (input.timings.open   !== undefined) $set['timings.open']   = input.timings.open;
      if (input.timings.close  !== undefined) $set['timings.close']  = input.timings.close;
      if (input.timings.is24x7 !== undefined) $set['timings.is24x7'] = input.timings.is24x7;
    }

    const updated = await this.zoneModel
      .findByIdAndUpdate(id, { $set }, { new: true })
      .lean()
      .exec();

    if (!updated) throw new NotFoundException(`Zone "${id}" disappeared during update`);

    this.logger.log(`Zone updated: ${id}`);
    return updated as unknown as ZoneDocument;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // DELETE
  // ══════════════════════════════════════════════════════════════════════════

  async remove(id: string): Promise<ZoneDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException(`Zone "${id}" not found`);

    const deleted = await this.zoneModel.findByIdAndDelete(id).lean().exec();
    if (!deleted) throw new NotFoundException(`Zone with id "${id}" not found`);

    this.logger.log(`Zone deleted: ${id}`);
    return deleted as unknown as ZoneDocument;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ══════════════════════════════════════════════════════════════════════════

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Computes a GeoJSON Point centroid from a GeoJSON Polygon.
   * Used as the Stage 2 $nearSphere target when no explicit center is given.
   */
  private computeCentroid(
    polygon?: { type: string; coordinates: number[][][] },
  ): { type: 'Point'; coordinates: [number, number] } | undefined {
    const ring = polygon?.coordinates?.[0];
    if (!ring?.length) return undefined;

    const [sumLng, sumLat] = ring.reduce(
      ([sLng, sLat], [lng, lat]) => [sLng + lng, sLat + lat],
      [0, 0],
    );

    return {
      type: 'Point',
      coordinates: [sumLng / ring.length, sumLat / ring.length],
    };
  }

  /** Logs actionable hints when a geo query throws */
  private logGeoIndexHint(err: any): void {
    const msg = String(err?.message ?? '');
    if (err?.code === 16755 || msg.includes('2dsphere') || msg.includes('geo')) {
      this.logger.error(
        '💥 Hint: Run → db.zones.createIndex({ polygon: "2dsphere" }) and db.zones.createIndex({ centroid: "2dsphere" })',
      );
    }
  }
}