import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@app/redis/redis.service';
import { ServiceService } from './service.service';

const mockAppUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  findById: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('signed-token'),
};

const mockRedisService = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  delete: jest.fn().mockResolvedValue(1),
};

describe('ServiceService', () => {
  let service: ServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        {
          provide: getModelToken('AppUser', 'usersConnection'),
          useValue: mockAppUserModel,
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
