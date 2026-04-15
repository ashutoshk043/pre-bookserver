import { Test, TestingModule } from '@nestjs/testing';
import { AuthresolverResolver } from './authresolver.resolver';

describe('AuthresolverResolver', () => {
  let resolver: AuthresolverResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthresolverResolver],
    }).compile();

    resolver = module.get<AuthresolverResolver>(AuthresolverResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
