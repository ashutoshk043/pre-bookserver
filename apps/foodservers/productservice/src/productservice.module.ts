import { Logger, Module } from '@nestjs/common';
import { ProductserviceController } from './productservice.controller';
import { ProductserviceService } from './productservice.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Module({
  imports: [
    // ✅ Global Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env',
    }),

    // ✅ Mongoose Connection using MONGO_FOOD_DB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const mongoUri = config.get<string>('MONGO_FOOD_DB');
        const logger = new Logger('AppModule');

        console.log('🧠 Mongo URI:', mongoUri);

        if (!mongoUri) {
          throw new Error('❌ MONGO_FOOD_DB not found in environment variables!');
        }

        // ✅ Connection Events
        mongoose.connection.on('connected', () => {
          logger.log('✅ Auth DB Connected Successfully!');
        });

        mongoose.connection.on('error', (err) => {
          logger.error('❌ Auth DB Connection Failed:', err);
        });

        mongoose.connection.on('disconnected', () => {
          logger.warn('⚠️ Auth DB Disconnected!');
        });

        return {
          uri: mongoUri,
          dbName: 'prebookuser',
        };
      },
    }),
  ],
  controllers: [ProductserviceController],
  providers: [ProductserviceService],
})
export class ProductserviceModule { }
