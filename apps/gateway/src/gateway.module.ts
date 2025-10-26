import { Module, Logger } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

async function waitForServices(urls: string[], interval = 2000) {
  const axios = require('axios');
  for (const url of urls) {
    let available = false;
    while (!available) {
      try {
        await axios.post(url, { query: '{ __typename }' });
        available = true;
      } catch (err) {
        console.log(`Service at ${url} not ready, retrying in ${interval}ms...`);
        await new Promise(r => setTimeout(r, interval));
      }
    }
  }
}

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: async () => {
        // ======================
        // 🔹 Local URLs (for dev)
        // ======================
        const localUrls = [
          'http://localhost:9000/graphql',
          'http://localhost:9001/graphql',
          'http://localhost:9002/graphql',
          'http://localhost:9004/graphql',
        ];

        // ======================
        // 🔹 Docker URLs (for container network)
        // ======================
        const dockerUrls = [
          'http://authservice:9000/graphql',
          'http://orderservice:9001/graphql',
          'http://productservice:9002/graphql',
          'http://restraurent:9004/graphql',
        ];

        const serviceUrls = process.env.NODE_ENV === 'docker' ? dockerUrls : localUrls;

        // ✅ Wait for all services to be up
        await waitForServices(serviceUrls);

        return {
          server: { playground: true },
          gateway: {
            supergraphSdl: new IntrospectAndCompose({
              subgraphs: process.env.NODE_ENV === 'docker' ? [
                { name: 'auth', url: 'http://authservice:9000/graphql' },
                { name: 'order', url: 'http://orderservice:9001/graphql' },
                { name: 'product', url: 'http://productservice:9002/graphql' },
                { name: 'restraurent', url: 'http://restraurent:9004/graphql' },
              ] : [
                { name: 'auth', url: 'http://localhost:9000/graphql' },
                { name: 'order', url: 'http://localhost:9001/graphql' },
                { name: 'product', url: 'http://localhost:9002/graphql' },
                { name: 'restraurent', url: 'http://localhost:9004/graphql' },
              ],
              pollIntervalInMs: 2000,
            }),
          },
        };
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
