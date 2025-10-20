import { Test, TestingModule } from '@nestjs/testing';
import { RestraurentResolver } from './restraurent.resolver';

describe('RestraurentResolver', () => {
  let resolver: RestraurentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestraurentResolver],
    }).compile();

    resolver = module.get<RestraurentResolver>(RestraurentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
