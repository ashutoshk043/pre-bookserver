import { Module } from '@nestjs/common';
import { ProductserviceController } from './productservice.controller';
import { ProductserviceService } from './productservice.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports:  [
        ConfigModule.forRoot({
          isGlobal: true, // har jagah available
        }),
      ],
  controllers: [ProductserviceController],
  providers: [ProductserviceService],
})
export class ProductserviceModule {}
