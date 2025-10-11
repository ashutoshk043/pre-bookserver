import { Injectable } from '@nestjs/common';

@Injectable()
export class UserserviceService {
  getHello(): string {
    return 'Hello World! from userservie';
  }
}
