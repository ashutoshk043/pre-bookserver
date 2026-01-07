import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableGlobalCors } from 'libs/cors/cors.helper';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import * as fs from 'fs';

function resolveProtoPath(): string {
  const candidates = [
    // ✅ build / docker / prod
    join(__dirname, 'grpc/proto/auth.proto'),

    // ✅ start:dev (ts-node)
    join(process.cwd(), 'apps/authservice/src/grpc/proto/auth.proto'),
  ];

  for (const path of candidates) {
    if (fs.existsSync(path)) {
      console.log('✅ Using protoPath:', path);
      return path;
    }
  }

  console.error('❌ gRPC proto file NOT FOUND. Tried paths:');
  candidates.forEach(p => console.error('  -', p));
  process.exit(1);
}

async function bootstrap() {
  console.log('🔄 [Auth] Bootstrapping Auth Service...');
  console.log('📂 __dirname:', __dirname);
  console.log('📂 process.cwd():', process.cwd());

  const app = await NestFactory.create(AppModule);
  enableGlobalCors(app);

  const HTTP_PORT = Number(process.env.AUTHSERVICEPORT) || 3000;
  const GRPC_PORT = Number(process.env.AUTH_GRPC_PORT) || 50051;

  const protoPath = resolveProtoPath();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${GRPC_PORT}`,
      package: 'auth',
      protoPath,
      loader: { keepCase: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(HTTP_PORT, '0.0.0.0');

  console.log(`🚀 HTTP running on ${HTTP_PORT}`);
  console.log(`📡 gRPC running on ${GRPC_PORT}`);
}

bootstrap();
