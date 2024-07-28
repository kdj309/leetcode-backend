import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GetUserByIdMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.url.split('/').pop();
    const user = await this.userService.getUser(userId);
    if (user) {
      //@ts-ignore
      req.profile = user;
      next();
    } else {
      throw new NotFoundException();
    }
  }
}
