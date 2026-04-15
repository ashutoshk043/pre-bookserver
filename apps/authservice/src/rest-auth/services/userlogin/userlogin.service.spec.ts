import { Test, TestingModule } from '@nestjs/testing';
import { UserloginService } from './userlogin.service';

describe('UserloginService', () => {
  let service: UserloginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserloginService],
    }).compile();

    service = module.get<UserloginService>(UserloginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
