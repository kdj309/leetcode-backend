import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getSuccessResponse } from 'src/utils';
import { RetrytokenService } from 'src/retrytoken/retrytoken.service';
import { SessiontokenService } from 'src/sessiontoken/sessiontoken.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private retryService: RetrytokenService,
    private jwtService: JwtService,
    private sessionService: SessiontokenService,
  ) {}

  async signIn(email: string, pass: string) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (!user.authenticate(pass)) {
        throw new UnauthorizedException();
      }
      const previoustoken = await this.retryService.findTokenByUserId(user.id);
      let refreshtoken: string;
      if (previoustoken) {
        refreshtoken = previoustoken.token;
      } else {
        //@ts-ignore
        refreshtoken = await this.retryService.createToken(user._id);
      }
      const payload = { sub: user.id, username: user.username };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: jwtConstants.secret,
      });
      const sessiontoken = await this.sessionService.createToken(user._id);
      return getSuccessResponse(
        {
          access_token: token,
          id: user._id,
          refreshtoken,
          sessiontoken,
        },
        'Sign-In Successfully',
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async verifyAndGenerateNewToken(token: string) {
    if (token == null) {
      throw new HttpException(
        'Refresh Token is required!',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const refreshToken = await this.retryService.findToken(token);

      if (!refreshToken) {
        throw new HttpException(
          'Refresh Token is required!',
          HttpStatus.BAD_REQUEST,
        );
      }
      //@ts-ignore
      const isExpired = await this.retryService.validateExpiry(refreshToken);

      if (isExpired) {
        await refreshToken.deleteOne();
        throw new HttpException(
          'Refresh token was expired. Please make a new signin request',
          HttpStatus.NOT_FOUND,
        );
      }
      //@ts-ignore
      const payload = {
        sub: refreshToken.userId,
        username: refreshToken.userId.username,
      };
      const newAccessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      });

      return getSuccessResponse(
        {
          accessToken: newAccessToken,
          refreshToken: refreshToken.token,
        },
        'Successfully created a new access token',
      );
    } catch (err) {
      throw err;
    }
  }

  async invalidatSessionToken(token: string) {
    try {
      await this.sessionService.invalidateSession(token);
      return;
    } catch (error) {
      throw error.message;
    }
  }
  async validateToken(token: string) {
    const session = await this.sessionService.validateSession(token);
    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }
    return session;
  }
  async invalidateRetryToken(token: string) {
    try {
      await this.retryService.findAndDelete(token);
      return;
    } catch (error) {
      throw error;
    }
  }
}
