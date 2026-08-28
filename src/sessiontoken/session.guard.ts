import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

interface RequestWithUser extends Request {
  user: string;
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const sessiontoken = request.cookies['session-token'];
    if (!sessiontoken) {
      throw new UnauthorizedException(
        'You are not logged in. Please log in to continue.',
      );
    }
    try {
      const token = await this.authService.validateToken(
        sessiontoken as string,
      );
      (request as RequestWithUser).user = token.userId._id.toString();
      return true;
    } catch (error) {
      throw new HttpException('Session Expired', 440);
    }
  }
}
