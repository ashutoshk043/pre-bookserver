import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { Restaurant } from '../models/restraurent_model';
import { restraurentService } from '../restraurent.service';
import { LoginserviceService } from '../loginservice/loginservice.service';
import { CreateRestaurantDto } from '../dtos/create_restraurent_input';
import { UpdateRestaurantDto } from '../dtos/update_restraurent_input';
import { LoginRestaurantDto } from '../dtos/login_restraurent_input';
import { RestaurantLoginResponse } from '../dtos/login_responce';
import { LogoutResponse } from '../dtos/logout_responce';
import {restProfileDTO} from '../dtos/rest_profile_responce';

@Resolver(() => Restaurant)
export class RestraurentResolver {
  constructor(private readonly restraurentService: restraurentService, private loginserviceService: LoginserviceService) { }

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
  console.log('==============================');
  console.log('📩 [GraphQL Mutation Triggered]: updateRestaurant');
  console.log('🆔 Restaurant ID:', id);
  console.log('📝 UpdateRestaurantDto:', JSON.stringify(updateRestaurantDto, null, 2));
  console.log('==============================');

  try {
    const result = await this.restraurentService.updateRestaurant(id, updateRestaurantDto);

    console.log('✅ [Service Response Received]');
    console.log('Updated Restaurant Data:', JSON.stringify(result, null, 2));
    console.log('==============================');

    return result;
  } catch (error) {
    console.error('🚨 [Error in GraphQL Resolver]:', error.message);
    console.log('==============================');
    throw error;
  }
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

  @Mutation(() => RestaurantLoginResponse, { name: 'loginRestraurentuser' })
  async loginRestraurentUser(
    @Args('loginData') loginData: LoginRestaurantDto,
    @Context() context: any, // 👈 GraphQL context
  ): Promise<RestaurantLoginResponse> {
    return this.loginserviceService.loginRestraurentUser(loginData, context);
  }


@Mutation(() => LogoutResponse, { name: 'logoutRestaurant' })
async logoutRestaurant(
  @Args('restId') rest_id: string,
  @Context() context: any,
): Promise<LogoutResponse> {
  try {
    const result = await this.loginserviceService.logoutRestraurentUser(rest_id, context);
    return { message: result.message };
  } catch (error) {
    throw new Error('Logout failed due to internal error');
  }
}



  // 🔹 Fetch Restaurant Profile by ID
@Query(() => restProfileDTO, { name: 'getRestaurantProfile' })
  async getRestaurantProfile(
    @Args('restId') rest_id: string,
  ): Promise<restProfileDTO> {
    // console.log('🔍 Fetching restaurant profile for:', rest_id);

    const restaurant = await this.loginserviceService.fetchRestDetails(rest_id);

    if (!restaurant) {
      throw new Error(`❌ Restaurant with ID ${rest_id} not found`);
    }

    // console.log('✅ Restaurant profile fetched successfully:', restaurant.name);
    return restaurant;
  }




}
