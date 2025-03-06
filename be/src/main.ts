import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import cookieParser from 'cookie-parser';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.DATABASE_PORT, 10) || 3010;
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.ENV_CORS,
    credentials: true,
  });
  app.setGlobalPrefix('api-consumo/v1/');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  console.log(port);
}
bootstrap();
