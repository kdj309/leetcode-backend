import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProblemsModule } from './problems/problems.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config/config';
import { AuthModule } from './auth/auth.module';
import { RetrytokenModule } from './retrytoken/retrytoken.module';
import { SessiontokenModule } from './sessiontoken/sessiontoken.module';
import { SubmissionService } from './submission/submission.service';
import { SubmissionController } from './submission/submission.controller';
import { SubmissionModule } from './submission/submission.module';
import { UserStatsService } from './user_stats/user_stats.service';
import { UserStatsController } from './user_stats/user_stats.controller';
import { UserStatsModule } from './user_stats/user_stats.module';
import { LeaderboardCacheService } from './leaderboard_cache/leaderboard_cache.service';
import { LeaderboardCacheController } from './leaderboard_cache/leaderboard_cache.controller';
import { LeaderboardCacheModule } from './leaderboard_cache/leaderboard_cache.module';

@Module({
  imports: [
    MongooseModule.forRoot(config().mongodb.database.connectionString),
    UsersModule,
    ProblemsModule,
    RetrytokenModule,
    AuthModule,
    SessiontokenModule,
    SubmissionModule,
    UserStatsModule,
    LeaderboardCacheModule,
  ],
  controllers: [AppController, SubmissionController, UserStatsController, LeaderboardCacheController],
  providers: [AppService],
})
export class AppModule {}
