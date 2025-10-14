import { Logger, Module } from '@nestjs/common';
import { ProductserviceController } from './productservice.controller';
import { ProductserviceService } from './productservice.service';
import { ConfigModule } from '@nestjs/config';
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
  controllers: [ProductserviceController],
  providers: [ProductserviceService],
})
export class ProductserviceModule { }
