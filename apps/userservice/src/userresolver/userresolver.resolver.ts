import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserresolverResolver {
     @Query(() => String)
      hello() {
        return 'Hello from User Resolver!';
      }
}
