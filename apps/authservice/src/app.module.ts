import { Module, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { AuthresolverResolver } from './rest-auth/authresolver/authresolver.resolver';
import { SharedGraphQLModule } from '@app/graphql';
import { RegisterService } from './rest-auth/services/register/register.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './rest-auth/models/user_Model';
import {
  Restaurant_details,
  Restaurant_detailsSchema,
} from './rest-auth/models/restraurent_model';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@app/redis/redis.module'; // ✅ Added
import { States, StateSchema } from './rest-auth/models/state_model';
import { Districts, DistrictSchema } from './rest-auth/models/distric_model';
import {
  SubDistricts,
  SubDistrictSchema,
} from './rest-auth/models/subdistrict_model';
import { Villages, VillageSchema } from './rest-auth/models/villagemodel';
import { AuthGrpcController } from './rest-auth/grpc/controllers/auth.grpc.controller';
import { UserloginService } from './rest-auth/services/userlogin/userlogin.service';
import { RestAuthModule } from './rest-auth/rest-auth.module';
import { AppAuthModule } from './app-auth/app-auth.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [
    // Global config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env',
    }),

    // Database connection
    DatabaseModule.forRoot([
      {
        name: 'usersConnection',
        dbName: 'userprebook',
        uriKey: 'MONGO_USER_DB',
      },
    ]),

    // Mongoose schemas
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Restaurant_details.name, schema: Restaurant_detailsSchema },
        { name: States.name, schema: StateSchema },
        { name: Districts.name, schema: DistrictSchema },
        { name: SubDistricts.name, schema: SubDistrictSchema },
        { name: Villages.name, schema: VillageSchema },
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
    }),

    // 🟢 Redis Module (MANDATORY)
    RedisModule,

    RestAuthModule,

    AppAuthModule,

    LocationsModule,
  ],
  controllers: [AuthGrpcController],
  providers: [
    AppService,
    AuthresolverResolver,
    RegisterService,
    UserloginService,
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    this.logger.log('🚀 AppModule Initialized...');
  }
}
