import { NestFactory } from '@nestjs/core';
import { OrderserviceModule } from './orderservice.module';


// async function bootstrap() {
//   const app = await NestFactory.create(OrderserviceModule);
//   const port = process.env.PORT ?? 3001;
//   await app.listen(port, '0.0.0.0'); // bind to all interfaces
//   console.log(`Orderservice running on port ${port}`);
// }
// bootstrap();

// async function bootstrap() {
//   const app = await NestFactory.create(OrderserviceModule);
//   await app.listen(process.env.ORDERSERVICEPORT ?? 3001, '0.0.0.0');
//   console.log(`Orderservice running on port ${process.env.ORDERSERVICEPORT}`);
// }
// bootstrap();


async function bootstrap() {
  const app = await NestFactory.create(OrderserviceModule);
  
  const port = process.env.ORDERSERVICEPORT || 3001;  // fallback port
  await app.listen(port, '0.0.0.0');  // important for Docker

  console.log(`🚀 AuthService running on port ${port}`);
}
bootstrap();
