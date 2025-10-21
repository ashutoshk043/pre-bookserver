import { Logger, Module } from '@nestjs/common';
import { ProductserviceService } from './productservice.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { ProductResolver } from './product/product.resolver';
import { SharedGraphQLModule } from '@app/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './models/product_model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env',
    }),

    DatabaseModule.forRoot([
      { name: 'ordersConnection', dbName: 'foodprebook', uriKey: 'MONGO_FOOD_DB' },
    ]),

    MongooseModule.forFeature(
      [{ name: Product.name, schema: ProductSchema }],
      'ordersConnection',
    ),

    SharedGraphQLModule.forRoot({
      federation: true,
      playground: true,
    }),
  ],
  providers: [ProductserviceService, ProductResolver],
})
export class ProductserviceModule {}
