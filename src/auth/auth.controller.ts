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
      //@ts-ignore
      response.cookie('access-token', authresponse.data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Should be true in production
        domain: 'localhost', // Specify the domain correctly
        path: '/',
      });
      //@ts-ignore
      response.cookie('id', authresponse.data.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Should be true in production
        domain: 'localhost', // Specify the domain correctly
        path: '/',
      });
      delete authresponse.data.access_token;
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
    //@ts-ignore
    response.clearCookie('access-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
      domain: 'localhost', // Or your domain
      path: '/', // Clear cookie for all routes
    });
    //@ts-ignore
    response.clearCookie('id', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
      domain: 'localhost', // Or your domain
      path: '/', // Clear cookie for all routes
    });
    return getSuccessResponse(null, 'SignOut Successfully');
  }
}
