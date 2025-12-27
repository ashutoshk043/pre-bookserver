import { Injectable } from '@nestjs/common';
import { GrpcClients } from '../clients/grpc.clients';

@Injectable()
export class GrpcDataService {
  constructor(private readonly grpcClients: GrpcClients) {}

  getRestaurant(id: string) {
    return this.grpcClients.getRestaurant(id);
  }

  getGrocery(id: string) {
    return this.grpcClients.getGrocery(id);
  }

  getMedical(id: string) {
    return this.grpcClients.getMedical(id);
  }
}
