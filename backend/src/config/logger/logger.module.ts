import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'http';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => {
        const isDev = config.get<string>('NODE_ENV') === 'development';

        return {
          pinoHttp: {
            level: isDev ? 'debug' : 'info',

            transport: isDev
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                  },
                }
              : undefined,

            // Ẩn thông tin nhạy cảm khỏi log
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'req.body.password',
              ],
              censor: '[REDACTED]',
            },

            // Thêm userId vào log
            customProps: (req: IncomingMessage) => ({
              userId:
                (req as IncomingMessage & { user?: { id: string } }).user?.id ||
                null,
            }),
          },
        };
      },
    }),
  ],

  exports: [LoggerModule],
})
export class PinoLoggerModule {}
