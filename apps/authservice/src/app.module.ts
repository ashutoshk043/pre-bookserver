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
import { RestraurentloginService } from './services/restraurentlogin/restraurentlogin.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@app/redis/redis.module';   // ✅ Added

@Module({
  imports: [
    // Global config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env',
    }),

    // Database connection
    DatabaseModule.forRoot([
      { name: 'usersConnection', dbName: 'userprebook', uriKey: 'MONGO_USER_DB' },
    ]),

    // Mongoose schemas
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Restaurant_details.name, schema: Restaurant_detailsSchema },
      ],
      'usersConnection',
    ),

    // GraphQL
    SharedGraphQLModule.forRoot({
      federation: true,
      playground: true,
    }),

    // JWT Module
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),

    // 🟢 Redis Module (MANDATORY)
    RedisModule,
  ],
  controllers: [],
  providers: [
    AppService,
    AuthresolverResolver,
    RegisterService,
    RestraurentloginService,
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    this.logger.log('🚀 AppModule Initialized...');
  }
}
