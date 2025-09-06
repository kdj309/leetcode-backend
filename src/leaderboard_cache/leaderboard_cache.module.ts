import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LeadBoardCache,
  LeadBoardCacheSchema,
} from 'src/Schemas/leaderboardcache.schema';
import { LeaderboardCacheController } from './leaderboard_cache.controller';
import { LeaderboardCacheService } from './leaderboard_cache.service';
import { UserStatsModule } from 'src/user_stats/user_stats.module';
import { LeaderboardProcessor } from './leadeboard-processor';
import { AuthModule } from 'src/auth/auth.module';
import { SessiontokenModule } from 'src/sessiontoken/sessiontoken.module';
import { UsersModule } from 'src/users/users.module';
import { SubmissionModule } from 'src/submission/submission.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeadBoardCache.name, schema: LeadBoardCacheSchema },
    ]),
    UserStatsModule,
    AuthModule,
    SessiontokenModule,
    UsersModule,
    SubmissionModule
  ],
  controllers: [LeaderboardCacheController],
  providers: [LeaderboardCacheService,LeaderboardProcessor],
  exports: [LeaderboardCacheService],
})
export class LeaderboardCacheModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
