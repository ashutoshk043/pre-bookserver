import { Module } from '@nestjs/common';
import { restraurentService } from './restraurent.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { SharedGraphQLModule } from '@app/graphql';

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
    SharedGraphQLModule.forRoot({
      federation: true,   // ya true agar federation use kar rahe ho
      playground: true,
    }),
  ],
  controllers: [],
  providers: [restraurentService],
})
export class restraurentModule { }
