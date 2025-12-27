import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableGlobalCors } from 'libs/cors/cors.helper';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  console.log('🔄 [Auth] Bootstrapping Auth Service...');

  // HTTP + GraphQL app
  const app = await NestFactory.create(AppModule);

  enableGlobalCors(app);
  console.log('✅ [Auth] Global CORS enabled');

  const GRPC_PORT = Number(process.env.AUTH_GRPC_PORT) || 50051;
  const HTTP_PORT = Number(process.env.AUTHSERVICEPORT) || 3000;

  const isDocker =
    process.env.NODE_ENV === 'docker' ||
    process.env.NODE_ENV === 'production';

  const protoPath = join(
    process.cwd(),
    isDocker
      ? 'dist/apps/authservice/src/grpc/proto/auth.proto'
      : 'apps/authservice/src/grpc/proto/auth.proto',
  );

  // 🔌 gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${GRPC_PORT}`,
      package: 'auth',
      protoPath,
      loader: {
        keepCase: true,
      },
    },
  });

  // Start gRPC
  await app.startAllMicroservices();
  console.log(`📡 [Auth][gRPC] Listening on 0.0.0.0:${GRPC_PORT}`);

  // Start HTTP / GraphQL
  await app.listen(HTTP_PORT, '0.0.0.0');
  console.log(`🚀 [Auth][HTTP] Listening on 0.0.0.0:${HTTP_PORT}`);
}

bootstrap().catch((err) => {
  console.error('❌ [Auth] Failed to start service', err);
  process.exit(1);
});
