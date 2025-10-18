import { NestFactory } from '@nestjs/core';
import { restraurentModule } from './restraurent.module';

async function bootstrap() {
  const app = await NestFactory.create(restraurentModule);
  
  const port = process.env.RESTRAURENTPORT || 3004;  // fallback port
  await app.listen(port, '0.0.0.0');  // important for Docker

  console.log(`🚀 AuthService running on port ${port}`);
}
bootstrap();
