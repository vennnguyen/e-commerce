import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { APP_CONFIG } from 'src/config/app/app.config';
import { ConfigService } from '@nestjs/config/dist/config.service';

export function setupApp(
  app: NestExpressApplication,
  logger: Logger,
  config: ConfigService,
): void {
  //cors
  const appConfig = config.getOrThrow<{ corsOrigin: string[] }>(APP_CONFIG);
  const corsAllowList = appConfig.corsOrigin;
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

  app.enableShutdownHooks();
}
