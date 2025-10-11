import { Module } from '@nestjs/common';
import { OrderserviceController } from './orderservice.controller';
import { OrderserviceService } from './orderservice.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:  [
      ConfigModule.forRoot({
        isGlobal: true, // har jagah available
      }),
    ],
  controllers: [OrderserviceController],
  providers: [OrderserviceService],
})
export class OrderserviceModule {}
