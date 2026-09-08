import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from './role.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/role.guard';
// import { GuestSessionInterceptor } from '../interceptors/guest-session.interceptor';
import { UserRole } from '../../shared/types/enum';

export function RequireRoles(...roles: UserRole[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard, RolesGuard),
    // UseInterceptors(GuestSessionInterceptor),
  );
}
