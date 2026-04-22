import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ServiceLocationService } from './service-location/service-location.service';
import { ResolverLocationResolver } from './resolver-location/resolver-location.resolver';

import { Zone, ZoneSchema } from './schemas/ zone.schema'; // ✅ no space

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Zone.name, schema: ZoneSchema }],
      'usersConnection', // ✅ IMPORTANT
    ),
  ],
  providers: [ServiceLocationService, ResolverLocationResolver],
  exports: [MongooseModule], // ✅ so other modules can use it if needed
})
export class LocationsModule {}