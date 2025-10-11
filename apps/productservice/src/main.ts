import { NestFactory } from '@nestjs/core';
import { ProductserviceModule } from './productservice.module';

// async function bootstrap() {
//   const app = await NestFactory.create(ProductserviceModule);
//   const port = process.env.PORT ?? 3002;
//   await app.listen(port, '0.0.0.0'); // bind to all interfaces
//   console.log(`Productservice running on port ${port}`);
// }
// bootstrap();

// async function bootstrap() {
//   const app = await NestFactory.create(ProductserviceModule);
//    await app.listen(process.env.PRODUCTSERVICEPORT ?? 3002, '0.0.0.0');
//   console.log(`Productservice running on port ${process.env.PRODUCTSERVICEPORT}`);
// }
// bootstrap();


async function bootstrap() {
  const app = await NestFactory.create(ProductserviceModule);
  
  const port = process.env.PRODUCTSERVICEPORT || 3002;  // fallback port
  await app.listen(port, '0.0.0.0');  // important for Docker

  console.log(`🚀 AuthService running on port ${port}`);
}
bootstrap();