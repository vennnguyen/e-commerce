import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { parseEnvOrigins } from './utils/parse-env-origin';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

const getCorsAllowList = (config: ConfigService) => {
  return parseEnvOrigins(
    config.get<string>('CLIENT_URL'),
    config.get<string>('CORS_OTHER_URL'),
  );
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const config = app.get(ConfigService);
  const logger = app.get(Logger);
  //cors
  const corsAllowList = getCorsAllowList(config);
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (corsAllowList.includes(origin)) {
        callback(null, true);
        return;
      }
      // log warning
      logger.warn(`CORS blocked for origin: ${origin}`);
      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    credentials: true,
  });

  // Validate Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.use(cookieParser());
  const port = config.get<number>('PORT') || 8080;
  await app.listen(port);
  logger.log(`Server is running on port ${port}`);
}
bootstrap();
