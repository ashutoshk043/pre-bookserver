import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Restaurant } from '../models/restraurent_model';
import { restraurentService } from '../restraurent.service';
import { CreateRestaurantDto } from '../dtos/create_restraurent_input';
import { UpdateRestaurantDto } from '../dtos/update_restraurent_input';

@Resolver(() => Restaurant)
export class RestraurentResolver {
  constructor(private readonly restraurentService: restraurentService) {}

  /**
   * 🟢 Mutation: Create a new Restaurant
   */
  @Mutation(() => Restaurant, { name: 'createRestaurant' })
  async createRestaurant(
    @Args('createRestaurantDto') createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restraurentService.createRestaurant(createRestaurantDto);
  }

  /**
   * 🟡 Query: Get all Restaurants
   */
  @Query(() => [Restaurant], { name: 'getAllRestaurants' })
  async getAllRestaurants(): Promise<Restaurant[]> {
    return this.restraurentService.getAllRestaurants();
  }

  /**
   * 🔵 Query: Get Restaurant by ID
   */
  @Query(() => Restaurant, { name: 'getRestaurantById' })
  async getRestaurantById(@Args('id', { type: () => ID }) id: string): Promise<Restaurant> {
    return this.restraurentService.getRestaurantById(id);
  }

  /**
   * 🟠 Mutation: Update Restaurant
   */
  @Mutation(() => Restaurant, { name: 'updateRestaurant' })
  async updateRestaurant(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateRestaurantDto') updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restraurentService.updateRestaurant(id, updateRestaurantDto);
  }

  /**
   * 🔴 Mutation: Delete Restaurant
   */
  @Mutation(() => Boolean, { name: 'deleteRestaurant' })
  async deleteRestaurant(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.restraurentService.deleteRestaurant(id);
  }

  /**
   * 🔹 Simple Test Query
   */
  @Query(() => String, { name: 'helloRestraurent' })
  hellorestraurent(): string {
    return this.restraurentService.getHello();
  }
}
