// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.AUTHSERVICEPORT ?? 3000, '0.0.0.0');
//   console.log(`Authservice running on port ${process.env.AUTHSERVICEPORT}`);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const port = process.env.AUTHSERVICEPORT || 3000;  // fallback port
  await app.listen(port, '0.0.0.0');  // important for Docker

  console.log(`🚀 AuthService running on port ${port}`);
}
bootstrap();

