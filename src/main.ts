import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

function handleListening(port: number): void {
  console.log(`===>  Server started port:${port}`);
}

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);

  app.enableCors({
    credentials: true,
    origin: [config.get('ORIGIN')],
    optionsSuccessStatus: 200,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: false }));
  // app.use(cookieParser());
  // app.use(helmet());
  // app.use(compression());
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix(config.get<string>('API_PREFIX') || '/api');

  const port = Number(config.get<number>('APP_PORT'));

  await app.listen(port, () => handleListening(port));
}
bootstrap().then();
