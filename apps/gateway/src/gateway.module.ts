import { Module, Logger } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: { playground: true },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            // { name: 'auth', url: 'http://authservice:9000/graphql' },
            // { name: 'user', url: 'http://userservice:9003/graphql' },
            // { name: 'order', url: 'http://orderservice:9001/graphql' },
            // { name: 'product', url: 'http://productservice:9002/graphql' },
            { name: 'auth', url: 'http://localhost:9000/graphql' },
            { name: 'user', url: 'http://localhost:9003/graphql' },
            { name: 'order', url: 'http://localhost:9001/graphql' },
            { name: 'product', url: 'http://localhost:9002/graphql' },
          ],
          pollIntervalInMs: 2000, // ✅ correct property
        }),
      },
    }),
  ],
})
export class GatewayModule {
  private readonly logger = new Logger(GatewayModule.name);
  constructor() {
    this.logger.log('🚀 GatewayModule initialized');
  }
}
