import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

@Injectable()
export class ObjectIdValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // do some tasks
    if (mongoose.Types.ObjectId.isValid(req.body.id)) {
      next();
    }
    return res.status(422).json({ message: 'Invalid Id' });
  }
}
