import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { CustomValidationPipe } from './common/pipes';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import express from 'express';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);
  const reflector = app.get(Reflector);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(compression());

  app.enableCors({
    credentials: true,
    origin: [config.get('ORIGIN'), 'http://localhost:3000'],
    optionsSuccessStatus: 200,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalPipes(new CustomValidationPipe());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix(config.get<string>('API_PREFIX') || '/api');

  const port = config.get<number>('APP_PORT') || 3003;

  await app.listen(port);
  console.log(`===> Server started on port: ${port}`);
  console.log(`===> Environment: ${config.get('NODE_ENV')}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
