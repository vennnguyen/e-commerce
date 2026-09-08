import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionAuthService } from 'src/app/auth/session-auth.service';
import { UserRole } from 'src/shared/types/enum';
import { ROLES_KEY } from '../decorators/role.decorator';

export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private sessionAuth: SessionAuthService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // const allowsUnregistered =
    //   requiredRoles && requiredRoles.includes(UserRole.UNREGISTERED);

    const fullUser = await this.sessionAuth.resolveAuthenticatedUser(
      request.headers,
    );
    if (fullUser) {
      request.user = fullUser;

      // kiểm tra user có đúng role không
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRole = requiredRoles.includes(fullUser.role);
        if (!hasRole) {
          this.logger.debug(
            `User role "${fullUser.role}" not in required roles [${requiredRoles}] — request denied`,
          );
          return false;
        }
      }

      return true;
    }
    // if (allowsUnregistered) {
    //   try {
    //     const { user, token } =
    //       await this.guestService.createGuestUserAndSession();

    //     request.user = user;
    //     request.guestSessionToken = token;

    //     return true;
    //   } catch (error) {
    //     this.logger.warn(`Failed to create guest user: ${error.message}`);
    //     return false;
    //   }
    // }

    this.logger.debug('No valid session — request denied');
    return false;
  }
}
