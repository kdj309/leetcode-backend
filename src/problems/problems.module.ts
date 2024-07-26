import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProblemsController } from './problems.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Problem, ProblemSchema } from 'src/Schemas/problem.schema';
import { ProblemsService } from './problems.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Problem.name, schema: ProblemSchema }]),
  ],
  controllers: [ProblemsController],
  providers: [ProblemsService],
})
export class ProblemsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
  }
}
