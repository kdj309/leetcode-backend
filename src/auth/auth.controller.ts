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
        path: '/signin'
      });
      return authresponse;
    } catch (error) {
      return {
        status: 'Failure',
        error: error.message,
      };
    }
  }
}
