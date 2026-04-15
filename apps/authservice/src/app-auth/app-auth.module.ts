import { Module } from '@nestjs/common';
import { ResolverResolver } from './resolver/resolver.resolver';
import { ServiceService } from './service/service.service';
import { RedisModule } from '@app/redis';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppUser, AppUserSchema } from './schemas/app-user.model';
import { ConfigModule } from '@nestjs/config';
import { UserAddress, UserAddressSchema } from './schemas/user-address.model';
import { AddressService } from './service/addresss/addresss.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env',
    }),
    MongooseModule.forFeature(
      [{ name: AppUser.name, schema: AppUserSchema },
        {name:UserAddress.name, schema:UserAddressSchema}
      ],
      'usersConnection',
    ),
    JwtModule.register({}),
    RedisModule,
  ],
  providers: [ServiceService,AddressService, ResolverResolver],
})
export class AppAuthModule {}
