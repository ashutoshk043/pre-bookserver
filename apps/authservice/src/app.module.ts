import { Module, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { AuthresolverResolver } from './authresolver/authresolver.resolver';
import { SharedGraphQLModule } from '@app/graphql';
import { RegisterService } from './services/register/register.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user_Model';
import { Restaurant_details, Restaurant_detailsSchema } from './models/restraurent_model';


@Module({
  imports: [
    // ✅ Global Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env',
    }),
    DatabaseModule.forRoot([
      { name: 'usersConnection', dbName: 'userprebook',uriKey: 'MONGO_USER_DB' },
      // { name: 'ordersConnection', dbName: 'foodprebook', uriKey: 'MONGO_FOOD_DB' },
      // { name: 'productConnection', dbName: 'foodprebook', uriKey: 'MONGO_FOOD_DB' },
    ]),

      // ✅ Register User Schema with the correct connection name
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema },
        { name: Restaurant_details.name, schema: Restaurant_detailsSchema },
      ],
      'usersConnection',
    ),


    // ✅ Global GraphQL Connection (reusable)
    SharedGraphQLModule.forRoot({
      federation: true,   // ya true agar federation use kar rahe ho
      playground: true,
    }),
  ],
  controllers: [],
  providers: [AppService,AuthresolverResolver, RegisterService],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    this.logger.log('🚀 AppModule Initialized...');
  }
}
