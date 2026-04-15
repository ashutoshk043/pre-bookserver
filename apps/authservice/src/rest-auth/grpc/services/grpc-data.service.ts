import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../models/user_Model';

@Injectable()
export class GrpcDataService {
  constructor(
    @InjectModel(User.name, 'usersConnection')
    private readonly userModel: Model<User>,
  ) {}

  async findUsersWithPagination({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search?: string;
  }) {
    const query: any = {};

    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    const total = await this.userModel.countDocuments(query);

    const users = await this.userModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('email');

    return { users, total };
  }
}
