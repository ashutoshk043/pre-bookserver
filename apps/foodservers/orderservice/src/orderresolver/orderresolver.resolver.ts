import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class OrderresolverResolver {
      @Query(() => String)
      hello1() {
        return 'Hello from Order Resolver!';
      }
}
