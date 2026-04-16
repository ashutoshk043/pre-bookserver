import { Resolver, Mutation, Args, Context, Query, ID } from '@nestjs/graphql';
import { ServiceService }       from '../service/service.service';
import { AddressService }       from '../service/addresss/addresss.service';
import { SendOtpInput }         from '../dtos/send-otp.input';
import { VerifyOtpInput }       from '../dtos/verify-otp.input';
import { RefreshTokenInput }    from '../dtos/refresh-token.input';
import { UpdateProfileInput }   from '../schemas/update-profile.input';
import { AddressInput }         from '../dtos/address.input';
import { AuthResponse, OtpResponse }  from '../types/auth.types';
import { UpdateProfileResponse }      from '../types/profile.types';
import { UserProfileResponse }        from '../types/user-profile.type';
import { AddressResponse, MutationResult } from '../dtos/address.input';
// import { LogoutResponse } from '../types/logoutResponce';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class ResolverResolver {
  constructor(
    private authService:    ServiceService,
    private addressService: AddressService,
  ) {}

  // ─────────────────────────────────────────────────────────────
  // 🔧 PRIVATE HELPER — extract userId from context
  //    Handles both JWT-populated req.user and x-user header
  // ─────────────────────────────────────────────────────────────

  private getUserId(context: any): string {
    if (!context.req.user && context.req.headers['x-user']) {
      context.req.user = JSON.parse(context.req.headers['x-user']);
    }
    return context.req.user.userId;
  }

  // ─────────────────────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────────────────────

  @Mutation(() => OtpResponse)
  async sendOtp(@Args('input') input: SendOtpInput) {
    return this.authService.sendOtp(input);
  }

  @Mutation(() => AuthResponse)
  async verifyOtp(@Args('input') input: VerifyOtpInput) {
    return this.authService.verifyOtp(input);
  }

  @Mutation(() => AuthResponse)
  async refreshToken(@Args('input') input: RefreshTokenInput) {
    console.log(input, "input")
    return this.authService.refreshToken(input.refreshToken);
  }

  // ─────────────────────────────────────────────────────────────
  // PROFILE
  // ─────────────────────────────────────────────────────────────

  @Mutation(() => UpdateProfileResponse)
  async updateProfile(
    @Args('input') input: UpdateProfileInput,
    @Context() context: any,
  ) {
    return this.authService.updateProfile(this.getUserId(context), input);
  }

  @Query(() => UserProfileResponse)
  async getMyProfile(@Context() context: any) {
    return this.authService.getMyFullProfile(this.getUserId(context));
  }

  // ─────────────────────────────────────────────────────────────
  // ADDRESSES
  // ─────────────────────────────────────────────────────────────

  @Query(() => [AddressResponse], { name: 'getUserAddresses' })
  getUserAddresses(@Context() context: any) {
    return this.addressService.getUserAddresses(this.getUserId(context));
  }

  @Query(() => AddressResponse, { name: 'getAddressById' })
  getAddressById(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: any,
  ) {
    return this.addressService.getAddressById(id, this.getUserId(context));
  }

@Mutation(() => AddressResponse, { name: 'addAddress' })
async addAddress(
  @Args('input') input: AddressInput,
  @Context() context: any,
) {
  // console.log(input, "input from fromy")
  return this.addressService.addAddress(this.getUserId(context), input);
}

  @Mutation(() => AddressResponse, { name: 'updateAddress' })
  updateAddress(
    @Args('id',    { type: () => ID }) id: string,
    @Args('input') input: AddressInput,
    @Context() context: any,
  ) {
    return this.addressService.updateAddress(id, this.getUserId(context), input);
  }

  @Mutation(() => MutationResult, { name: 'deleteAddress' })
  deleteAddress(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: any,
  ) {
    return this.addressService.deleteAddress(id, this.getUserId(context));
  }

  @Mutation(() => AddressResponse, { name: 'setDefaultAddress' })
  setDefaultAddress(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: any,
  ) {
    return this.addressService.setDefaultAddress(id, this.getUserId(context));
  }


// In your resolver file
// @Mutation(() => LogoutResponse)
// async logout(@Context() context: any) {
//   // Get userId from context (your existing method)
//   const userId = this.getUserId(context);
  
//   if (!userId) {
//     throw new UnauthorizedException('User not authenticated');
//   }
  
//   return this.authService.logout(userId);
// }



}