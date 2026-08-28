import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import { LoggerModule } from 'nestjs-pino';
import { CORRELATION_ID_HEADER } from 'src/core/middlewares/correlation-id.middleware';

@Module({
  imports: [
    LoggerModule.forRootAsync({
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
            genreqId: (req, res) => {
              const existing = req.headers[CORRELATION_ID_HEADER];
              const id = existing || randomUUID();
              req.headers[CORRELATION_ID_HEADER] = id;
              res.setHeader(CORRELATION_ID_HEADER, id);
              return id;
            },

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
