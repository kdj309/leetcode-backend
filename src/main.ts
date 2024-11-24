import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as apiconfig } from './config/config';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN
      ? process.env.FRONTEND_ORIGIN
      : 'http://localhost:5173',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Leetcode backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(apiconfig().port);
}
bootstrap();
