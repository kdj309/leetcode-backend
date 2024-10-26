import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const sessiontoken = request.cookies['session-token'];
    if (!sessiontoken) {
      throw new UnauthorizedException();
    }
    try {
      const token = await this.authService.validateToken(
        sessiontoken as string,
      );
      //@ts-ignore
      request.user = token.userId;
      return true;
    } catch (error) {
      throw new HttpException('Session Expired', 440);
    }
  }
}
