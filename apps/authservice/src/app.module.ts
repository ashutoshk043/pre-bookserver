import { Module, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { AuthresolverResolver } from './authresolver/authresolver.resolver';
import { SharedGraphQLModule } from '@app/graphql';


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
    // ✅ Global GraphQL Connection (reusable)
    SharedGraphQLModule.forRoot({
      federation: false,   // ya true agar federation use kar rahe ho
      playground: true,
    }),
  ],
  controllers: [],
  providers: [AppService,AuthresolverResolver],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    this.logger.log('🚀 AppModule Initialized...');
  }
}
