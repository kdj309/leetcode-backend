import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProblemsController } from './problems.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Problem, ProblemSchema } from 'src/Schemas/problem.schema';
import { ProblemsService } from './problems.service';
import { GetUserByIdMiddleware } from 'src/middlewares/get-user-by-id.middleware';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Problem.name, schema: ProblemSchema }]),
    UsersModule,
  ],
  controllers: [ProblemsController],
  providers: [ProblemsService],
})
export class ProblemsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetUserByIdMiddleware)
      .forRoutes(
ProblemsController
      );
  }
}
