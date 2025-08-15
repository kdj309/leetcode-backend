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


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeadBoardCache.name, schema: LeadBoardCacheSchema },
    ]),
    UserStatsModule,
    AuthModule,
    SessiontokenModule
  ],
  controllers: [LeaderboardCacheController],
  providers: [LeaderboardCacheService,LeaderboardProcessor],
  exports: [LeaderboardCacheService],
})
export class LeaderboardCacheModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
