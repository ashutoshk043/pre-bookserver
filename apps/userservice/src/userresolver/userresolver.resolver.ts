import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserresolverResolver {
     @Query(() => String)
      hello3() {
        return 'Hello from User Resolver!';
      }
}
