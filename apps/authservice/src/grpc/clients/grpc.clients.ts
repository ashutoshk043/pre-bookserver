import { Injectable, OnModuleInit } from '@nestjs/common';
import * as microservices from '@nestjs/microservices';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';

interface RestaurantService {
  GetRestaurantInfo(data: { restaurantId: string }): any;
}

interface GroceryService {
  GetGroceryInfo(data: { groceryId: string }): any;
}

interface MedicalService {
  GetMedicalInfo(data: { medicalId: string }): any;
}

@Injectable()
export class GrpcClients implements OnModuleInit {
  @microservices.Client({
    transport: microservices.Transport.GRPC,
    options: {
      package: 'restaurant',
      protoPath: join(__dirname, 'proto/restaurant.proto'),
      url: 'auth-restaurant:50052',
    },
  })
  private restaurantClient: microservices.ClientGrpc;

  @microservices.Client({
    transport: microservices.Transport.GRPC,
    options: {
      package: 'grocery',
      protoPath: join(__dirname, 'proto/grocery.proto'),
      url: 'auth-grocery:50053',
    },
  })
  private groceryClient: microservices.ClientGrpc;

  @microservices.Client({
    transport: microservices.Transport.GRPC,
    options: {
      package: 'medical',
      protoPath: join(__dirname, 'proto/medical.proto'),
      url: 'auth-medical:50054',
    },
  })
  private medicalClient: microservices.ClientGrpc;

  private restaurantService: RestaurantService;
  private groceryService: GroceryService;
  private medicalService: MedicalService;

  onModuleInit() {
    this.restaurantService = this.restaurantClient.getService<RestaurantService>('RestaurantService');
    this.groceryService = this.groceryClient.getService<GroceryService>('GroceryService');
    this.medicalService = this.medicalClient.getService<MedicalService>('MedicalService');
  }

  async getRestaurant(id: string) {
    return await firstValueFrom(this.restaurantService.GetRestaurantInfo({ restaurantId: id }));
  }

  async getGrocery(id: string) {
    return await firstValueFrom(this.groceryService.GetGroceryInfo({ groceryId: id }));
  }

  async getMedical(id: string) {
    return await firstValueFrom(this.medicalService.GetMedicalInfo({ medicalId: id }));
  }
}
