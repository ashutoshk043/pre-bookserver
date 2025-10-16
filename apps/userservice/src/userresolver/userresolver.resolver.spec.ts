import { Test, TestingModule } from '@nestjs/testing';
import { UserresolverResolver } from './userresolver.resolver';

describe('UserresolverResolver', () => {
  let resolver: UserresolverResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserresolverResolver],
    }).compile();

    resolver = module.get<UserresolverResolver>(UserresolverResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
