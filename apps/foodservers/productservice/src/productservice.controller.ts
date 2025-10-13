import { Controller, Get } from '@nestjs/common';
import { ProductserviceService } from './productservice.service';

@Controller()
export class ProductserviceController {
  constructor(private readonly productserviceService: ProductserviceService) {}

  @Get()
  getHello(): string {
    return this.productserviceService.getHello();
  }
}
