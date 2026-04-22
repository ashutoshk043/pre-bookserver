/**
 * resolver-location.resolver.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * GraphQL resolver for the Zone / Location resource.
 *
 * Queries:
 *   zones(page, limit, search?, isActive?, districtId?) → ZonePage
 *   zone(id)                                            → ZoneType
 *
 * Mutations:
 *   createZone(input: ZoneInput)          → ZoneType
 *   updateZone(id: ID!, input: ZoneInput) → ZoneType
 *   deleteZone(id: ID!)                   → DeleteZoneResult
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { Args, Float, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { ServiceLocationService } from '../service-location/service-location.service';
import { ZoneType, ZonePage } from '../types/zone.types';
import { ZoneInput, ZoneFilterDto } from '../dtos/zone.input';
import { DeleteZoneResult } from '../dtos/delete-zone-result.dto';

@Resolver(() => ZoneType)
@UsePipes(
  new ValidationPipe({
    transform: true,   // coerces plain args into class instances
    whitelist: true,   // strips unknown properties
    forbidNonWhitelisted: false,
  }),
)
export class ResolverLocationResolver {

  constructor(private readonly zoneService: ServiceLocationService) { }

  // ── QUERIES ────────────────────────────────────────────────────────────────

  /**
   * Paginated zone list — matches Angular GET_ZONES query exactly:
   *   query GetZones($page: Int!, $limit: Int!) {
   *     zones(page: $page, limit: $limit) { data { ... } total page limit totalPages }
   *   }
   */
  @Query(() => ZonePage, { name: 'zones', description: 'Paginated, filterable zone list' })
  async zones(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('isActive', { type: () => Boolean, nullable: true }) isActive?: boolean,
    @Args('districtId', { type: () => String, nullable: true }) districtId?: string,
  ): Promise<ZonePage> {
    const dto: ZoneFilterDto = { page, limit, search, isActive, districtId };
    return this.zoneService.findAll(dto);
  }

  /**
   * Single zone by id:
   *   query GetZone($id: ID!) { zone(id: $id) { _id name slug ... } }
   */
  @Query(() => ZoneType, { name: 'zone', description: 'Fetch a single zone by ObjectId' })
  async zone(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ZoneType> {
    return this.zoneService.findOne(id) as unknown as ZoneType;
  }

  // ── MUTATIONS ──────────────────────────────────────────────────────────────

  /**
   * Create — matches Angular CREATE_ZONE mutation:
   *   mutation CreateZone($input: ZoneInput!) { createZone(input: $input) { _id ... } }
   */
  @Mutation(() => ZoneType, { name: 'createZone', description: 'Create a new delivery zone' })
  async createZone(
    @Args('input', { type: () => ZoneInput }) input: ZoneInput,
  ): Promise<ZoneType> {
    return this.zoneService.create(input) as unknown as ZoneType;
  }

  /**
   * Update — matches Angular UPDATE_ZONE mutation:
   *   mutation UpdateZone($id: ID!, $input: ZoneInput!) { updateZone(id: $id, input: $input) { _id ... } }
   */
  @Mutation(() => ZoneType, { name: 'updateZone', description: 'Partially update an existing zone' })
  async updateZone(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => ZoneInput }) input: ZoneInput,
  ): Promise<ZoneType> {
    return this.zoneService.update(id, input) as unknown as ZoneType;
  }

  /**
   * Delete — matches Angular DELETE_ZONE mutation:
   *   mutation DeleteZone($id: ID!) { deleteZone(id: $id) { _id } }
   */
  @Mutation(() => DeleteZoneResult, { name: 'deleteZone', description: 'Permanently delete a zone' })
  async deleteZone(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<DeleteZoneResult> {
    const deleted = await this.zoneService.remove(id);
    return { _id: String((deleted as any)._id) };
  }

@Query(() => ZonePage)
async getZones(
  @Args('lat', { type: () => Float, nullable: true }) lat?: number,
  @Args('lng', { type: () => Float, nullable: true }) lng?: number,
  @Args('search', { type: () => String, nullable: true }) search?: string,
  @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
  @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit?: number,
) {
  return this.zoneService.getZones(lat, lng, search, page, limit);
}
}