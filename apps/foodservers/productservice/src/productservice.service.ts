import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductserviceService {
  getHello(): string {
    return 'Hello World! from prodcutservice';
  }
}
