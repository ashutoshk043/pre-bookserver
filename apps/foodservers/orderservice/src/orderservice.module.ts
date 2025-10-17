import { Logger, Module } from '@nestjs/common';
import { OrderserviceService } from './orderservice.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { OrderresolverResolver } from './orderresolver/orderresolver.resolver';
import { SharedGraphQLModule } from '@app/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './models/order.model';

@Module({
  imports: [
    // ✅ Global Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env',
    }),

    // ✅ Mongoose Connection using MONGO_FOOD_DB
    DatabaseModule.forRoot([
      //  { name: 'usersConnection', dbName: 'userprebook',uriKey: 'MONGO_USER_DB' },
      { name: 'ordersConnection', dbName: 'foodprebook', uriKey: 'MONGO_FOOD_DB' },
      // { name: 'productConnection', dbName: 'foodprebook', uriKey: 'MONGO_FOOD_DB' },
    ]),
    // ✅ Use custom connection name here
    MongooseModule.forFeature(
      [{ name: Order.name, schema: OrderSchema }],
      'ordersConnection'
    ),

    SharedGraphQLModule.forRoot({
      federation: true,   // ya true agar federation use kar rahe ho
      playground: true,
    }),
  ],
  controllers: [],
  providers: [OrderserviceService, OrderresolverResolver],
})
export class OrderserviceModule {

}
