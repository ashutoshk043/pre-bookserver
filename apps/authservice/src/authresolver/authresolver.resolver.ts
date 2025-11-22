import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { RegisterService } from '../services/register/register.service';
import { User } from '../models/user_Model';
import { CreateUserInput } from '../dtos/create_user_input';
import { RestaurantLoginResponse } from '../dtos/restraurent_login_responce';
import { RestraurentLoginDTO } from '../dtos/restraurent_login_input';
import { RestraurentloginService } from '../services/restraurentlogin/restraurentlogin.service';
import { LogoutResponse } from '../dtos/logout_responce';


@Resolver(() => User)
export class AuthresolverResolver {
  constructor(private readonly registerService: RegisterService, private restraurentloginservice: RestraurentloginService) { }

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
    return await this.registerService.createUser(createUserInput);
  }

@Query(() => [User], { name: 'getAllUsers' })
async getAllUsers(
  @Args('restId', { type: () => String }) restId: string
): Promise<User[]> {
  const result = await this.registerService.findAllUsers(restId);
  return result;
}





  // login mutations

@Mutation(() => RestaurantLoginResponse, { name: 'loginRestraurent' })
async loginRestraurent(
  @Args('loginData') loginData: RestraurentLoginDTO,
  @Context() context: any, 
): Promise<RestaurantLoginResponse> {
  return this.restraurentloginservice.loginRestraurent(loginData, context);
}


  @Mutation(() => LogoutResponse, { name: 'logout' })
async logout(
  @Args('restId') rest_id: string,
  @Context() context: any,
): Promise<LogoutResponse> {
  try {
    const result = await this.registerService.logoutRestraurentUser(rest_id, context);
    return { message: result.message };
  } catch (error) {
    throw new Error('Logout failed due to internal error');
  }
}





}
