import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { SharedGraphQLModule } from '@app/graphql';
import { JwtModule } from '@nestjs/jwt'; // ✅ Import JwtModule
import { Restaurant, RestaurantSchema } from './models/restraurent_model';
import { restraurentService } from './restraurent.service';
import { RestraurentResolver } from './restraurent/restraurent.resolver';
import { LoginserviceService } from './loginservice/loginservice.service';
import { RedisModule } from '@app/redis/redis.module';


@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env',
    }),

    DatabaseModule.forRoot([
      { name: 'ordersConnection', dbName: 'foodprebook', uriKey: 'MONGO_FOOD_DB' },
    ]),

    MongooseModule.forFeature(
      [{ name: Restaurant.name, schema: RestaurantSchema }],
      'ordersConnection',
    ),

    SharedGraphQLModule.forRoot({
      federation: true,
      playground: true,
    }),

    // ✅ Add JwtModule here
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey', // put your JWT secret here
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [restraurentService, RestraurentResolver, LoginserviceService],
  exports: [LoginserviceService], // optional if used in other modules
})
export class restraurentModule {}
