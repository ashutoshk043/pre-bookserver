import { Controller, Get } from '@nestjs/common';
import { UserserviceService } from './userservice.service';

@Controller()
export class UserserviceController {
  constructor(private readonly userserviceService: UserserviceService) {}

  @Get()
  getHello(): string {
    return this.userserviceService.getHello();
  }
}
