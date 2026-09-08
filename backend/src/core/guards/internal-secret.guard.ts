import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { verifyInternalSecret } from 'src/shared/utils/internal-secret.util';

@Injectable() // bảo vệ các route chỉ cho phép truy cập từ các dịch vụ nội bộ (internal services) bằng cách kiểm tra header "x-internal-secret" trong request. Nếu giá trị của header này không khớp với giá trị cấu hình trong biến môi trường "INTERNAL_API_SECRET", thì sẽ ném ra UnauthorizedException.
export class InternalSecretGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const raw = request.headers?.['x-internal-secret'];
    const provided = Array.isArray(raw) ? raw[0] : raw;
    const expected = this.configService.get<string>('INTERNAL_API_SECRET');

    if (!verifyInternalSecret(provided, expected)) {
      throw new UnauthorizedException('Invalid internal secret');
    }

    return true;
  }
}
