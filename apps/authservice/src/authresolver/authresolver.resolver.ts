import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { RegisterService } from '../services/register/register.service';
import { User } from '../models/user_Model';
import { CreateUserInput } from '../dtos/create_user_input';

@Resolver(() => User)
export class AuthresolverResolver {
  constructor(private readonly registerService: RegisterService) { }

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

  // ✅ Get all users
  // @Query(() => [User], { name: 'getAllUsers' })
  // async getAllUsers(): Promise<User[]> {
  //   return await this.registerService.findAllUsers();
  // }

  // ✅ Get single user by ID
  // @Query(() => User, { name: 'getUserById', nullable: true })
  // async getUserById(@Args('id', { type: () => ID }) id: string): Promise<User | null> {
  //   return await this.registerService.findUserById(id);
  // }
}
