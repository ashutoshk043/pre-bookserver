import { Module } from '@nestjs/common';
import { UserserviceController } from './userservice.controller';
import { UserserviceService } from './userservice.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // har jagah available
    }),
  ],
  controllers: [UserserviceController],
  providers: [UserserviceService],
})
export class UserserviceModule { }
