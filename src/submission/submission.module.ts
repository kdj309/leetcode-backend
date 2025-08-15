import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from 'src/Schemas/submission.schema';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { AuthModule } from 'src/auth/auth.module';
import { SessiontokenModule } from 'src/sessiontoken/sessiontoken.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }]),
    AuthModule,
    SessiontokenModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
