import { Module } from '@nestjs/common';
import { ProductserviceController } from './productservice.controller';
import { ProductserviceService } from './productservice.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // har jagah available
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_FOOD_DB'),
        dbName: 'foodprebook', // optional: override db name if needed
      }),
    }),
  ],
  controllers: [ProductserviceController],
  providers: [ProductserviceService],
})
export class ProductserviceModule { }
