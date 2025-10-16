import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ProductResolver {
     @Query(() => String)
          hello2() {
            return 'Hello from Product Resolver!';
          }
}
