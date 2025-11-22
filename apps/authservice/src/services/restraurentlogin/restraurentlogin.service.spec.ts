import { Test, TestingModule } from '@nestjs/testing';
import { RestraurentloginService } from './restraurentlogin.service';

describe('RestraurentloginService', () => {
  let service: RestraurentloginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestraurentloginService],
    }).compile();

    service = module.get<RestraurentloginService>(RestraurentloginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
