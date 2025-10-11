import { NestFactory } from '@nestjs/core';
import { UserserviceModule } from './userservice.module';

async function bootstrap() {
  const app = await NestFactory.create(UserserviceModule);
   await app.listen(process.env.USERSERVICEPORT ?? 3003, '0.0.0.0');
  console.log(`UserService running on port ${process.env.USERSERVICEPORT}`);
}
bootstrap();

// async function bootstrap() {
//   const app = await NestFactory.create(UserserviceModule);
//   const port = process.env.PORT ?? 3003;
//   await app.listen(port, '0.0.0.0'); // bind to all interfaces
//   console.log(`Productservice running on port ${port}`);
// }
// bootstrap();
