import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadBoardCache, LeadBoardCacheSchema } from 'src/Schemas/leaderboardcache.schema';
import { LeaderboardCacheController } from './leaderboard_cache.controller';
import { LeaderboardCacheService } from './leaderboard_cache.service';

@Module({
    imports: [MongooseModule.forFeature([
    { name: LeadBoardCache.name, schema: LeadBoardCacheSchema }
    ])  ],
    controllers: [LeaderboardCacheController],
    providers: [LeaderboardCacheService],  
    exports: [LeaderboardCacheService],
})
export class LeaderboardCacheModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
    }
}
