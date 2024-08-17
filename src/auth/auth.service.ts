import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (!user.authenticate(pass)) {
        throw new UnauthorizedException();
      }
      const payload = { sub: user.id, username: user.username };
      //@ts-ignore
      return {
        //@ts-ignore
        status: 'Success',
        data: {
          access_token: await this.jwtService.signAsync(payload),
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
