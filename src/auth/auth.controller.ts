import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/signin-user.dto';

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
}
