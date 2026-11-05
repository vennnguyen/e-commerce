import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionAuthService } from 'src/app/auth/session-auth.service';
import { User } from 'src/app/user/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionAuth: SessionAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const fullUser = await this.sessionAuth.resolveAuthenticatedUser(
      request.headers,
    );

    if (fullUser) {
      request.user = fullUser;
      return true;
    }

    throw new UnauthorizedException('Bạn cần đăng nhập để tiếp tục');
  }
}
