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
import { ObjectIdValidationMiddleware } from 'src/middlewares/objectid.validation';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: Userschema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ObjectIdValidationMiddleware)
      .forRoutes({ path: 'users:id', method: RequestMethod.GET });
  }
}
