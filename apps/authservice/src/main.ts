import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableGlobalCors } from 'libs/cors/cors.helper';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import * as fs from 'fs';

function resolveProtoFromPackage(): string {
  const p = join(
    process.cwd(),
    'node_modules/@tivr/grpc-protos/proto/auth/auth.proto'
  );

  if (!fs.existsSync(p)) {
    console.error('❌ auth.proto not found at', p);
    process.exit(1);
  }

  console.log('✅ Using protoPath:', p);
  return p;
}




async function bootstrap() {
  // console.log('🔄 [Auth] Bootstrapping Auth Service...');
  // console.log('📂 __dirname:', __dirname);
  // console.log('📂 process.cwd():', process.cwd());

  const app = await NestFactory.create(AppModule);
  enableGlobalCors(app);

  const HTTP_PORT = Number(process.env.AUTHSERVICEPORT) || 3000;
  const GRPC_PORT = Number(process.env.AUTH_GRPC_PORT) || 50051;

  const protoPath = resolveProtoFromPackage();

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
