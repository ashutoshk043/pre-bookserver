import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderserviceService {
  getHello(): string {
    return 'Hello World! order service';
  }
}
