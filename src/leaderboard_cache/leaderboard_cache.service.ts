import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Model } from 'mongoose';
import { LeadBoardCache } from 'src/Schemas/leaderboardcache.schema';
import { UserStat } from 'src/Schemas/userstat.schema';

@Injectable()
export class LeaderboardCacheService {
  private readonly CACHE_KEYS = {
    GLOBAL_LEADERBOARD: 'leaderboard:global',
    USER_RANKINGS: 'leaderboard:rankings',
    LAST_UPDATE: 'leaderboard:lastUpdate',
  };
  constructor(
    @InjectModel(LeadBoardCache.name)
    private LeadboardCacheModule: Model<LeadBoardCache>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}
  private readonly CACHE_TTL_SECONDS = 3600; // 1 hour
  private readonly CACHE_TTL_MS = this.CACHE_TTL_SECONDS * 1000;
  async create(leaderboardData: UserStat[]) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.CACHE_TTL_MS);
    try {
      await this.redis
        .multi()
        .set(
          this.CACHE_KEYS.GLOBAL_LEADERBOARD,
          JSON.stringify(leaderboardData),
          'EX',
          this.CACHE_TTL_SECONDS,
        )
        .set(
          this.CACHE_KEYS.LAST_UPDATE,
          new Date().toISOString(),
          'EX',
          this.CACHE_TTL_SECONDS,
        )
        .exec();
      const leaderboardCache = new this.LeadboardCacheModule({
        rankings: leaderboardData,
        generatedAt: new Date(),
        expiresAt,
      });
      await leaderboardCache.save();
      return {
        success: true,
        data: leaderboardCache,
        message: 'Leaderboard cache created successfully',
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(`Error in  leaderboard create method ${error.message}`);
    }
  }
  async invalidateCache(): Promise<void> {
    try {
      await this.redis
        .multi()
        .del(this.CACHE_KEYS.GLOBAL_LEADERBOARD)
        .del(this.CACHE_KEYS.USER_RANKINGS)
        .del(this.CACHE_KEYS.LAST_UPDATE)
        .exec();
    } catch (error) {
      throw new Error(`Failed to invalidate cache: ${error.message}`);
    }
  }
  async getLeaderboard(): Promise<UserStat[]> {
    try {
      const cached = await this.redis.get(this.CACHE_KEYS.GLOBAL_LEADERBOARD);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      throw new Error(`Failed to get leaderboard from cache: ${error.message}`);
    }
  }
}
