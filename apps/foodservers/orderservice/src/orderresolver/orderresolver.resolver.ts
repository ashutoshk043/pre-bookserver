import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class OrderresolverResolver {
      @Query(() => String)
      hello() {
        return 'Hello from Order Resolver!';
      }
}
