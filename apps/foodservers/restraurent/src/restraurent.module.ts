import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { SharedGraphQLModule } from '@app/graphql';
import { Restaurant, RestaurantSchema } from './models/restraurent_model';
import { restraurentService } from './restraurent.service';
import { RestraurentResolver } from './restraurent/restraurent.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env',
    }),

    DatabaseModule.forRoot([
      { name: 'ordersConnection', dbName: 'foodprebook', uriKey: 'MONGO_FOOD_DB' },
    ]),

    // 🔹 Important: Register Restaurant schema with Mongoose
    MongooseModule.forFeature(
      [{ name: Restaurant.name, schema: RestaurantSchema }],
      'ordersConnection', // connection name must match DatabaseModule
    ),

    SharedGraphQLModule.forRoot({
      federation: true,
      playground: true,
    }),
  ],
  providers: [restraurentService, RestraurentResolver],
})
export class restraurentModule {}
