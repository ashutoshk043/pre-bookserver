import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { RegisterService } from '../services/register/register.service';
import { User } from '../models/user_Model';
import { CreateUserInput } from '../dtos/create_user_input';
import { RestaurantLoginResponse } from '../dtos/restraurent_login_responce';
import { RestraurentLoginDTO } from '../dtos/restraurent_login_input';
import { UserloginService } from '../services/userlogin/userlogin.service';
import { LogoutResponse } from '../dtos/logout_responce';
import { States } from '../models/state_model';
import { Districts } from '../models/distric_model';
import { SubDistricts } from '../models/subdistrict_model';
import { Villages } from '../models/villagemodel';
import { UpdateUserInput } from '../dtos/update_user_input';
import { RefreshTokenResponse } from '../types/refresh-token-responce';
@Resolver(() => User)
export class AuthresolverResolver {
  constructor(
    private readonly registerService: RegisterService,
    private userLoginservice: UserloginService,
  ) {}

  // ✅ Test Query
  @Query(() => String)
  hello(): string {
    return 'Hello from Auth Resolver!';
  }

  // ✅ Register new user
  @Mutation(() => User, { name: 'registerUser' })
  async registerUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.registerService.createUser(createUserInput);
  }

  @Query(() => [User], { name: 'getAllUsers' })
  async getAllUsers(): Promise<User[]> {
    return this.registerService.findAllUsers();
  }

  // login mutations

  @Mutation(() => RestaurantLoginResponse, { name: 'loginRestraurent' })
  async loginRestraurent(
    @Args('loginData') loginData: RestraurentLoginDTO,
    @Context() context: any,
  ): Promise<RestaurantLoginResponse> {
    return this.userLoginservice.loginUser(loginData, context);
  }

  @Mutation(() => LogoutResponse)
  async logout(@Context() context: any): Promise<LogoutResponse> {
    return this.registerService.logoutUser(context);
  }

  @Mutation(() => LogoutResponse, { name: 'deleteUser' })
  async deleteUser(@Args('userId') userId: string): Promise<LogoutResponse> {
    try {
      const result = await this.registerService.deleteUser(userId);
      return { message: result.message };
    } catch (error) {
      throw new Error('Delete failed: ' + error.message);
    }
  }

  @Query(() => [States]) // <-- ARRAY OF STATE
  async getAllStates() {
    return this.registerService.getAllStates();
  }

  @Query(() => [Districts], { name: 'getAllDistricts' })
  async getAllDistricts(
    @Args('stateName', { type: () => String }) stateName: string,
  ): Promise<Districts[]> {
    return await this.registerService.getAllDistricts(stateName);
  }

  @Query(() => [SubDistricts], { name: 'GetAllSubDistricts' })
  async GetAllSubDistricts(
    @Args('districtName', { type: () => String }) districtName: string,
  ): Promise<SubDistricts[]> {
    // ✅ Sahi type
    return await this.registerService.getAllSubDistricts(districtName);
  }

  @Query(() => [Villages], { name: 'getAllVillages' })
  async getAllVillages(
    @Args('subDistrictName', { type: () => String }) subDistrictName: string,
  ): Promise<Villages[]> {
    return await this.registerService.getAllVillages(subDistrictName);
  }

  // ✅ Update existing user
  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return await this.registerService.updateUser(updateUserInput);
  }

  @Mutation(() => RefreshTokenResponse, {name:'restaurentRefreshToken'})
  async refreshToken(@Args('refreshToken') token: string) {
    console.log('♻️ Refresh mutation reached AUTH SERVICE', token);
    return this.userLoginservice.restaurentRefreshToken(token);
  }
}
