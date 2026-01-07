import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RegisterService } from '../../services/register/register.service';

@Controller()
export class AuthGrpcController {
  constructor(private readonly registerService: RegisterService) { }

  @GrpcMethod('AuthService', 'GetAllUsers')
  async getAllUsers() {
    const users = await this.registerService.findAllUsers('all');

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
      })),
      total: result.total,
      page,
      limit,
    };
  }




}

