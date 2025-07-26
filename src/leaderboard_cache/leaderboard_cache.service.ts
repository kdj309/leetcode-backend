import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeadBoardCache } from 'src/Schemas/leaderboardcache.schema';

@Injectable()
export class LeaderboardCacheService {
  constructor(
    @InjectModel(LeadBoardCache.name)
    private LeadboardCacheModule: Model<LeadBoardCache>,
  ) {}
  async create(leaderboardData: any) {
    try {
      const leaderboardCache = new this.LeadboardCacheModule(leaderboardData);
      await leaderboardCache.save();
      return { success: true, data: leaderboardCache, message: 'Leaderboard cache created successfully' };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
}
