import { Controller, Get } from '@nestjs/common';
import { OrderserviceService } from './orderservice.service';

@Controller()
export class OrderserviceController {
  constructor(private readonly orderserviceService: OrderserviceService) {}

  @Get()
  getHello(): string {
    return this.orderserviceService.getHello();
  }
}
