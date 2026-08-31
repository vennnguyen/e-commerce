import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { APP_CONFIG } from './config/app/app.config';
import { setupApp } from './bootstraps/setup-app';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';
import { setupSwagger } from './bootstraps/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const config = app.get(ConfigService);
  const appConfig = config.getOrThrow<{ port: number }>(APP_CONFIG);
  const logger = app.get(Logger);

  setupApp(app, logger, config);
  setupSwagger(app);
  const port = appConfig.port;
  await app.listen(port);
  logger.log(`Server is running on port ${port}`);
  logger.log(`Swagger document available at: http://localhost:${port}/docs`);
}
bootstrap().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
