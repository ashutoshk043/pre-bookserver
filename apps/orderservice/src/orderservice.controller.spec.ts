import { Test, TestingModule } from '@nestjs/testing';
import { OrderserviceController } from './orderservice.controller';
import { OrderserviceService } from './orderservice.service';

describe('OrderserviceController', () => {
  let orderserviceController: OrderserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderserviceController],
      providers: [OrderserviceService],
    }).compile();

    orderserviceController = app.get<OrderserviceController>(OrderserviceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(orderserviceController.getHello()).toBe('Hello World!');
    });
  });
});
