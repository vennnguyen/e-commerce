import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entites/account.entity';
import { Session } from './entites/session.entity';
import { Verification } from './entites/verification.entity';
import { SessionAuthService } from './session-auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { RolesGuard } from 'src/core/guards/role.guard';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Session, Verification]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [SessionAuthService, AuthGuard, RolesGuard],
  exports: [SessionAuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
