import { Test, TestingModule } from '@nestjs/testing';
import { LoginserviceService } from './loginservice.service';

describe('LoginserviceService', () => {
  let service: LoginserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginserviceService],
    }).compile();

    service = module.get<LoginserviceService>(LoginserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
