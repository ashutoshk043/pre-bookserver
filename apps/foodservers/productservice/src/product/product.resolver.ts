import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ProductResolver {
     @Query(() => String)
          hello() {
            return 'Hello from Product Resolver!';
          }
}
