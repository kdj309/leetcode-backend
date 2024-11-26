import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/signin-user.dto';
import { getSuccessResponse } from 'src/utils';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: signInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const authresponse = await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      );
      response.cookie('access-token', authresponse.data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Should be true in production
        domain:
          process.env.NODE_ENV === 'production'
            ? process.env.DOMAIN
            : 'localhost', // Specify the domain correctly
        path: '/',
        maxAge: 60 * 60 * 1000,
        sameSite:"none"
      });
      response.cookie('id', authresponse.data.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Should be true in production
        domain:
          process.env.NODE_ENV === 'production'
            ? process.env.DOMAIN
            : 'localhost', // Specify the domain correctly
        path: '/',
        sameSite:"none"
      });
      response.cookie('refresh-token', authresponse.data.refreshtoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        domain:
          process.env.NODE_ENV === 'production'
            ? process.env.DOMAIN
            : 'localhost',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite:"none"
      });
      response.cookie('session-token', authresponse.data.sessiontoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 1 * 24 * 60 * 60 * 1000,
        sameSite:"none"
      });
      delete authresponse.data.access_token;
      delete authresponse.data.refreshtoken;
      delete authresponse.data.sessiontoken;
      return authresponse;
    } catch (error) {
      return {
        status: 'Failure',
        error: error.message,
      };
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.invalidatSessionToken(req.cookies['session-token']);
    await this.authService.invalidateRetryToken(req.cookies['refresh-token']);
    response.clearCookie('access-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
      domain:
        process.env.NODE_ENV === 'production'
          ? process.env.DOMAIN
          : 'localhost', // Or your domain
      path: '/', // Clear cookie for all routes
      sameSite:"none"
    });
    response.clearCookie('id', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
      domain:
        process.env.NODE_ENV === 'production'
          ? process.env.DOMAIN
          : 'localhost', // Or your domain
      path: '/', // Clear cookie for all routes
      sameSite:"none"
    });
    response.clearCookie('refresh-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
      domain:
        process.env.NODE_ENV === 'production'
          ? process.env.DOMAIN
          : 'localhost', // Or your domain
      path: '/', // Clear cookie for all routes
      sameSite:"none"
    });
    response.clearCookie('session-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
      domain:
        process.env.NODE_ENV === 'production'
          ? process.env.DOMAIN
          : 'localhost', // Or your domain
      path: '/', // Clear cookie for all routes
      sameSite:"none"
    });
    return getSuccessResponse(null, 'SignOut Successfully');
  }

  @Post('refresh')
  async createRefreshToken(@Req() request: Request, @Res() response: Response) {
    try {
      const refreshToken = request.cookies['refresh-token'];
      const newtokenresponse = await this.authService.verifyAndGenerateNewToken(
        refreshToken,
      );
      response.cookie('refresh-token', newtokenresponse.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
        sameSite:"none"
      });
      response.cookie('access-token', newtokenresponse.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000, // 15 mintues
        path: '/',
        sameSite:"none"
      });
      delete newtokenresponse.data.refreshToken;
      delete newtokenresponse.data.accessToken;
      response.json(newtokenresponse);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/session/validation')
  async sessionValidation(@Req() request: Request) {
    try {
      const sessionToken = request.cookies['session-token'] as string;
      const token = await this.authService.validateToken(sessionToken);
      if (token) {
        return getSuccessResponse(
          { isExpired: false, user: token.userId },
          'Successfully validated the session',
        );
      } else {
        return getSuccessResponse(
          { isExpired: true, user: null },
          'Successfully validated the session',
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
