import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import {
  buildErrorPayload,
  buildUnknownErrorPayload,
  extractErrorResponse,
} from 'src/shared/helpers/api-error-response';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(AllExceptionsFilter.name);
  }
  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') return;
    const httpCtx = host.switchToHttp();
    const response = httpCtx.getResponse<Response>();
    const request = httpCtx.getRequest<Request>();

    const ctx = {
      requestId: (request.headers['x-request-id'] as string) ?? '',
      path: request.url,
    };
    // http Exceptions
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const rawErrorResponse = exception.getResponse();

      if (typeof rawErrorResponse === 'string') {
        response
          .status(statusCode)
          .json(
            buildErrorPayload(statusCode, rawErrorResponse, undefined, ctx),
          );
        return;
      }

      const { message, error } = extractErrorResponse(
        rawErrorResponse as Record<string, unknown>,
        exception.message,
      );

      response
        .status(statusCode)
        .json(buildErrorPayload(statusCode, message, error, ctx));
      return;
    }

    //unknown Exceptions
    this.logger.error({
      requestId: ctx.requestId,
      path: ctx.path,
      error: exception instanceof Error ? exception.message : 'Unknown error',
      stack: exception instanceof Error ? exception.stack : undefined,
      msg: 'unhandled.exception',
    });

    const unknownErrorPayload = buildUnknownErrorPayload(exception, ctx);
    response.status(unknownErrorPayload.statusCode).json(unknownErrorPayload);
    return;
  }
}
