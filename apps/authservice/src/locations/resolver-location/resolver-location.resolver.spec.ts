import { Test, TestingModule } from '@nestjs/testing';
import { ResolverLocationResolver } from './resolver-location.resolver';

describe('ResolverLocationResolver', () => {
  let resolver: ResolverLocationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResolverLocationResolver],
    }).compile();

    resolver = module.get<ResolverLocationResolver>(ResolverLocationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
