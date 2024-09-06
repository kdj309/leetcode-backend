import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getSuccessResponse } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (!user.authenticate(pass)) {
        throw new UnauthorizedException();
      }
      const payload = { sub: user.id, username: user.username };
      return getSuccessResponse(
        {
          access_token: await this.jwtService.signAsync(payload),
          id: user._id,
        },
        'Sign-In Successfully',
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
