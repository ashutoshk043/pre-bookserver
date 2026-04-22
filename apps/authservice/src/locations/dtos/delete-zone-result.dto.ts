/**
 * delete-zone-result.dto.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Lightweight return type for the deleteZone mutation.
 *
 * The frontend DELETE_ZONE mutation only reads back `_id`:
 *   mutation DeleteZone($id: ID!) {
 *     deleteZone(id: $id) { _id }
 *   }
 *
 * Returning only `_id` (rather than the full Zone) avoids a second DB query
 * just to satisfy the shape — the deleted document's _id is already in memory.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Confirmation payload returned after a successful zone deletion' })
export class DeleteZoneResult {

  @Field(() => ID, { description: 'The _id of the zone that was deleted' })
  _id!: string;
}