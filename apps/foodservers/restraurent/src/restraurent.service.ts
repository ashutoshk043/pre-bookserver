import { Injectable } from '@nestjs/common';

@Injectable()
export class restraurentService {
  getHello(): string {
    return 'Hello World!';
  }
}
