import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserStat, UserStatSchema } from 'src/Schemas/userstat.schema';
import { UserStatsController } from './user_stats.controller';
import { UserStatsService } from './user_stats.service';
import { Submission, SubmissionSchema } from 'src/Schemas/submission.schema';
import { AuthModule } from 'src/auth/auth.module';
import { SessiontokenModule } from 'src/sessiontoken/sessiontoken.module';
import { User, Userschema } from 'src/Schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserStat.name,
        schema: UserStatSchema,
      },
      {
        name: Submission.name,
        schema: SubmissionSchema,
      },
      {
        name: User.name,
        schema: Userschema,
      },
    ]),
    AuthModule,
    SessiontokenModule,
  ],
  controllers: [UserStatsController],
  providers: [UserStatsService],
  exports: [UserStatsService],
})
export class UserStatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
