import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from 'src/Schemas/submission.schema';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { AuthModule } from 'src/auth/auth.module';
import { SessiontokenModule } from 'src/sessiontoken/sessiontoken.module';
import { User, Userschema } from 'src/Schemas/user.schema';
import { UserStatsModule } from 'src/user_stats/user_stats.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: Userschema }]),
    AuthModule,
    SessiontokenModule,
    UserStatsModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
