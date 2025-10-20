import { NestFactory } from '@nestjs/core';
import { restraurentModule } from './restraurent.module';
import { enableGlobalCors } from 'libs/cors/cors.helper';


async function bootstrap() {
  const app = await NestFactory.create(restraurentModule);

  const port = process.env.RESTRAURENTPORT || 3004;

  // Enable CORS for Angular frontend
  enableGlobalCors(app)

  await app.listen(port, '0.0.0.0'); // Docker friendly
  console.log(`🚀 RestaurantService running on port ${port}`);
}
bootstrap();

