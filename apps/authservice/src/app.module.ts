import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
 imports: [
      // ✅ Global Config
      ConfigModule.forRoot({
        isGlobal: true,
      }),
  
      // ✅ Mongoose Connection using MONGO_USER_DB
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          uri: config.get<string>('MONGO_USER_DB'),
          dbName: 'prebookuser', // optional: override db name if needed
        }),
      }),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
