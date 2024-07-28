import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, Userschema } from 'src/Schemas/user.schema';
import { GetUserByIdMiddleware } from 'src/middlewares/get-user-by-id.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: Userschema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetUserByIdMiddleware)
      .forRoutes({ path: ':id/:userId', method: RequestMethod.DELETE });
  }
}
