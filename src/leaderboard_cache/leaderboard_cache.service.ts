import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedisClientType } from 'redis';
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
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) { }
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
          { EX: this.CACHE_TTL_SECONDS },
        )
        .set(
          this.CACHE_KEYS.LAST_UPDATE,
          new Date().toISOString(),
          { EX: this.CACHE_TTL_SECONDS },
        )
        .exec();
      await this.LeadboardCacheModule.deleteMany({
        generatedAt: { $lt: new Date(Date.now() - this.CACHE_TTL_MS) }
      });

      const leaderboardCache = new this.LeadboardCacheModule({
        cacheKey: this.CACHE_KEYS.GLOBAL_LEADERBOARD,
        userCount: leaderboardData.length,
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
      const pipeline = this.redis.multi();

      pipeline.del(this.CACHE_KEYS.GLOBAL_LEADERBOARD);
      pipeline.del(this.CACHE_KEYS.USER_RANKINGS);
      pipeline.del(this.CACHE_KEYS.LAST_UPDATE);
      const results = await pipeline.exec();

      await this.LeadboardCacheModule.updateOne(
        { cacheKey: this.CACHE_KEYS.GLOBAL_LEADERBOARD },
        { $set: { expiresAt: new Date() } }
      );
      console.log('✅ Cache invalidated successfully');
    } catch (error) {
      throw new Error(`Failed to invalidate cache: ${error.message}`);
    }
  }
  async getLeaderboard(): Promise<UserStat[] | null> {
    try {
      const cached = await this.redis.get(this.CACHE_KEYS.GLOBAL_LEADERBOARD);
      if (!cached || typeof cached !== 'string') {
        return null;
      }
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get leaderboard from cache: ${errorMessage}`);
    }
  }
  async getLeaderboardPaginated(page: number, limit: number) {
    try {
      const cached = await this.getLeaderboard();
      if (!cached) {
        return null;
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = cached.slice(startIndex, endIndex);

      return {
        users: paginatedData,
        pagination: {
          page,
          limit,
          totalUsers: cached.length,
          totalPages: Math.ceil(cached.length / limit),
          hasNextPage: endIndex < cached.length,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      console.error('Error getting paginated leaderboard:', error);
      return null;
    }
  }
}
