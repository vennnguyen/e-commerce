import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { apiBadRequest } from '../../shared/helpers/api-i18n';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';

interface EmailVerifyJwtPayload {
  email?: string;
  updateTo?: string;
  requestType?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async verifyEmailCustom(token: string, email: string) {
    const secret = this.configService.get<string>('BETTER_AUTH_SECRET');
    console.log('BETTER_AUTH_SECRET:', secret);
    if (!secret) {
      apiBadRequest('errors.auth.secretNotConfigured');
    }

    let payload: EmailVerifyJwtPayload;
    try {
      payload = jwt.verify(token, secret, {
        algorithms: ['HS256'],
      }) as EmailVerifyJwtPayload;
    } catch (e: any) {
      if (e?.name === 'TokenExpiredError') {
        this.logger.warn({ msg: 'auth.token.expired', email });
        apiBadRequest('errors.auth.tokenExpired');
      }
      this.logger.warn({
        msg: 'auth.token.invalid',
        email,
        reason: e?.message ?? 'unknown',
      });
      apiBadRequest('errors.auth.verificationFailed', {
        reason: e?.message ?? 'invalid token',
      });
    }

    if (!payload?.email || typeof payload.email !== 'string') {
      this.logger.warn({ msg: 'auth.token.invalidPayload', email });
      apiBadRequest('errors.auth.invalidTokenPayload');
    }

    if (payload.updateTo || payload.requestType) {
      this.logger.warn({ msg: 'auth.storefrontOnlyFlow', email });
      apiBadRequest('errors.auth.storefrontOnlyFlow');
    }

    const tokenEmail = payload.email.toLowerCase();
    if (tokenEmail !== email.toLowerCase()) {
      this.logger.warn({
        msg: 'auth.token.emailMismatch',
        tokenEmail,
        providedEmail: email,
      });
      apiBadRequest('errors.auth.emailMismatch');
    }

    await this.userService.verifyUser(email);

    this.logger.log({ msg: 'auth.email.verified', email });

    return {
      success: true,
      message: 'Xác thực email thành công!',
      user: null,
    };
  }
}
