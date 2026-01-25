import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableGlobalCors } from 'libs/cors/cors.helper';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import * as fs from 'fs';

// // ✅ Proto path from installed NPM package
// function resolveProtoFromPackage(): string {
//   try {
//     // NPM package ka path (node_modules ke andar)
//     const protoPath = require.resolve('@tivr/grpc-protos/proto/auth/auth.proto');
//     console.log('✅ Using protoPath from package:', protoPath);
//     return protoPath;
//   } catch (err) {
//     console.error('❌ Could not find auth.proto in @tivr/grpc-protos package');
//     process.exit(1);
//   }
// }

function resolveProtoFromPackage(): string {
  const possiblePaths = [
    // 1️⃣ prod / build
    join(__dirname, '../../node_modules/@tivr/grpc-protos/proto/auth/auth.proto'),
    // 2️⃣ ts-node / dev
    join(process.cwd(), 'node_modules/@tivr/grpc-protos/proto/auth/auth.proto'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      console.log('✅ Using protoPath:', p);
      return p;
    }
  }

  console.error('❌ Could not find restaurant.proto in @tivr/grpc-protos package. Tried paths:');
  possiblePaths.forEach(p => console.error('  -', p));
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
