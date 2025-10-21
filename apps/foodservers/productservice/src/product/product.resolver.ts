import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductDto } from '../dtos/create_product';
import { Product } from '../models/product_model';
import { ProductserviceService } from '../productservice.service';
import { UpdateProductDto } from '../dtos/update_product';


@Resolver()
export class ProductResolver {
   
  constructor(private readonly productService: ProductserviceService) {}

   @Mutation(() => Product) 
  async createProduct(@Args('input') input: CreateProductDto) {
    return this.productService.create(input);
  }

  @Mutation(() => Product)
  async updateProduct(@Args('input') input: UpdateProductDto) {
    return this.productService.update(input.id, input);
  }

  @Mutation(() => Product)
  async hideProduct(@Args('id') id: string) {
    return this.productService.hideProduct(id);
  }

  @Mutation(() => Product)
  async restoreProduct(@Args('id') id: string) {
    return this.productService.restoreProduct(id);
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Args('id') id: string) {
    return this.productService.hardDelete(id);
  }

  @Query(() => [Product])
  async getProducts() {
    return this.productService.findAll();
  }

  @Query(() => [Product])
  async getProductsByRestaurant(@Args('restaurantId') restaurantId: string) {
    return this.productService.findByRestaurant(restaurantId);
  }
}
