import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AuthresolverResolver {

  @Query(() => String)
  hello() {
    return 'Hello from Auth Resolver!';
  }
}
