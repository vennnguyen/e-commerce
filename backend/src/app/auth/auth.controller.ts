import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { SessionAuthService } from './session-auth.service';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { User } from '../user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ResEx } from 'src/swagger/response-examples';

@ApiTags('Xác thực - Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly sessionAuth: SessionAuthService,
  ) {}
  private mapUserToResponse(user: User) {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  private async sessionFromRequest(req: { headers: any }) {
    const ctx = await this.sessionAuth.resolveSessionContext(req);
    if (!ctx) {
      return null;
    }

    return {
      user: this.mapUserToResponse(ctx.user),
      session: {
        token: ctx.session.token,
        expiresAt: ctx.session.expiresAt,
      },
    };
  }

  @Get('me')
  @ApiOperation({
    summary: 'Lấy thông tin user hiện tại (Bearer hoặc cookie session)',
    operationId: 'auth_get_me',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Thông tin user hiện tại',
    schema: {
      example: ResEx.auth.me,
    },
  })
  async getCurrentUser(@Req() req: any) {
    const session = await this.sessionFromRequest(req);

    if (!session?.user) {
      return {
        success: false,
        authenticated: false,
        message: 'Not authenticated',
        user: null,
      };
    }

    const fullUser = await this.userService.getUser(session.user.id);

    return {
      success: true,
      authenticated: true,
      user: fullUser ? this.mapUserToResponse(fullUser) : session.user,
    };
  }

  @Get('session')
  @ApiOperation({
    summary: 'Lấy session (token, hết hạn, user)',
    operationId: 'auth_get_session',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Thông tin session hiện tại',
    schema: {
      example: ResEx.auth.session,
    },
  })
  async getSession(@Req() req: any) {
    const session = await this.sessionFromRequest(req);

    if (!session?.session) {
      return {
        success: false,
        authenticated: false,
      };
    }

    return {
      success: true,
      authenticated: true,
      session: {
        token: session.session.token,
        expiresAt: session.session.expiresAt,
      },
      user: session.user,
    };
  }

  @Get('check')
  @ApiOperation({
    summary: 'Kiểm tra đã đăng nhập hay chưa',
    operationId: 'auth_check',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Kiểm tra đã đăng nhập hay chưa',
    schema: {
      example: ResEx.auth.check,
    },
  })
  @HttpCode(HttpStatus.OK) //mặc định trả về 200 OK
  async checkAuth(@Req() req: any) {
    const session = await this.sessionFromRequest(req);

    if (!session?.user) {
      return {
        authenticated: false,
        user: null,
      };
    }

    return {
      authenticated: true,
      user: session.user,
    };
  }
}
