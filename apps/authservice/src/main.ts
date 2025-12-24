import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableGlobalCors } from 'libs/cors/cors.helper';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  console.log('🔄 Bootstrapping Auth Service...');

  const app = await NestFactory.create(AppModule);

  enableGlobalCors(app);
  console.log('✅ Global CORS enabled');

  const GRPC_PORT = Number(process.env.AUTH_GRPC_PORT) || 50051;
  const HTTP_PORT = Number(process.env.AUTHSERVICEPORT) || 3000;

  const isDocker =
    process.env.NODE_ENV === 'docker' ||
    process.env.NODE_ENV === 'production';

  const protoPath = isDocker
    ? 'dist/apps/authservice/src/proto/auth.proto'
    : 'apps/authservice/src/proto/auth.proto';

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(process.cwd(), protoPath),
      url: `0.0.0.0:${GRPC_PORT}`,
    },
  });
  await app.startAllMicroservices();
  console.log(`📡 gRPC Auth Service running on port ${GRPC_PORT}`);

  await app.listen(HTTP_PORT, '0.0.0.0');
  console.log(`🚀 AuthService HTTP + GraphQL running on port ${HTTP_PORT}`);
}
bootstrap();
