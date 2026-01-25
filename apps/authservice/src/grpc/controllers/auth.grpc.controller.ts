import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RegisterService } from '../../services/register/register.service';

@Controller()
export class AuthGrpcController {
  constructor(private readonly registerService: RegisterService) { }

  @GrpcMethod('AuthService', 'GetAllUsers')
  async getAllUsers() {
    const users = await this.registerService.findAllUsers();

    return {
      users: users.map(u => ({
        id: u._id.toString(),
        name: u.name,
      })),
    };
  }


  @GrpcMethod('AuthService', 'GetUserEmails')
  async getUserEmails(data: {
    page: number;
    limit: number;
    search?: string;
  }) {
    const { page, limit, search } = data;

    const result = await this.registerService.findUsersWithPagination({
      page,
      limit,
      search,
    });

    return {
      data: result.users.map(u => ({
        email: u.email,
        id:u._id.toString()
      })),
      total: result.total,
      page,
      limit,
    };
  }



/* =========================
     UPDATE USER RESTAURANT ✅
  ========================== */
@GrpcMethod('AuthService', 'UpdateUserRestaurant')
async updateUserRestaurant(data: {
  ownerEmail: string;
  restaurantId: string;
}) {
  // console.log('📡 [Auth gRPC] UpdateUserRestaurant called');
  // console.log('➡️ Payload:', data);

  const result = await this.registerService.addRestaurantToUser(
    data.ownerEmail,
    data.restaurantId,
  );

  // console.log('✅ User updated with restaurant');
  // console.log('⬅️ Response:', result);

  return result;
}

}

