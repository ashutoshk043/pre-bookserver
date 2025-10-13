import { Test, TestingModule } from '@nestjs/testing';
import { ProductserviceController } from './productservice.controller';
import { ProductserviceService } from './productservice.service';

describe('ProductserviceController', () => {
  let productserviceController: ProductserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductserviceController],
      providers: [ProductserviceService],
    }).compile();

    productserviceController = app.get<ProductserviceController>(ProductserviceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(productserviceController.getHello()).toBe('Hello World!');
    });
  });
});
