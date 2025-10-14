import { Logger, Module } from '@nestjs/common';
import { OrderserviceController } from './orderservice.controller';
import { OrderserviceService } from './orderservice.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@app/database';

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
    ],
  controllers: [OrderserviceController],
  providers: [OrderserviceService],
})
export class OrderserviceModule {}
