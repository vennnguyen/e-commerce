import { HttpStatus } from '@nestjs/common';

export type ApiErrorPayload = {
  success: false;
  statusCode: number;
  message: string;
  error: string;
  requestId?: string;
  timestamp?: string;
  path?: string;
};
export type ApiErrorContext = {
  requestId?: string;
  path?: string;
};

export function buildErrorPayload(
  statusCode: number,
  message: string | string[],
  error: string,
  ctx: ApiErrorContext,
): ApiErrorPayload {
  return {
    success: false,
    statusCode,
    message: formatErrorMessage(message),
    error,
    timestamp: new Date().toISOString(),
    requestId: ctx.requestId,
    path: ctx.path,
  };
}

const formatErrorMessage = (message: string | string[]) => {
  if (Array.isArray(message)) {
    return message
      .map((msg) => msg.trim())
      .filter(Boolean)
      .join(', ');
  }
  return message.trim();
};

// extract error and message from error response object
type NestErrorResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export function extractErrorResponse(
  body: Record<string, unknown> | NestErrorResponse,
  fallbackMessage: string,
) {
  const b = body as NestErrorResponse;
  const message = b.message !== undefined ? b.message : fallbackMessage;

  const error =
    typeof b.error === 'string' && b.error !== '' ? b.error : undefined;

  return {
    message,
    error,
  };
}

//unknown error response
export function buildUnknownErrorPayload(
  exception: unknown,
  ctx: ApiErrorContext,
): ApiErrorPayload {
  const prod = process.env.NODE_ENV === 'production';
  if (exception instanceof Error) {
    return buildErrorPayload(
      HttpStatus.INTERNAL_SERVER_ERROR,
      prod ? 'Internal server error' : exception.message,
      'Internal server error',
      ctx,
    );
  }
  return buildErrorPayload(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Internal server error',
    'Internal server error',
    ctx,
  );
}
