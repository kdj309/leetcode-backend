import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LeaderboardCacheService } from './leaderboard_cache.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionGuard } from 'src/sessiontoken/session.guard';
import { getFailureResponse, getSuccessResponse } from 'src/utils';
import { LeaderboardJobs } from 'src/interfaces/config.interface';
import { UserStatsService } from 'src/user_stats/user_stats.service';

@Controller('leaderboard-cache')
export class LeaderboardCacheController {
  constructor(
    private readonly leaderBoardService: LeaderboardCacheService,
    private readonly userStatService: UserStatsService,
    @InjectQueue('leaderboard') private leaderBoardQueue: Queue,
  ) {}

  @UseGuards(AuthGuard, SessionGuard)
  @Get()
  async getLeaderBoard() {
    try {
      const cachedData = await this.leaderBoardService.getLeaderboard();
      if (cachedData) {
        return getSuccessResponse(cachedData, 'Cached leaderboard data');
      }
      const stats = await this.userStatService.getAllUsersSorted();
      await this.leaderBoardService.create(stats);
      
      return getSuccessResponse(stats, 'Returns the cached leaderboard data');
    } catch (error) {
      return getFailureResponse(error);
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Post('refresh')
  async refreshCache() {
    try {
      const job = await this.leaderBoardQueue.add(
        LeaderboardJobs.UPDATE_LEADERBOARD_CACHE,
        {},
        {
          priority: 1,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      );
      return getSuccessResponse(
        job.id,
        'Cache refresh job queued successfully',
      );
    } catch (error) {
      return getFailureResponse(error);
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Post('recalculate')
  async recalculateRanks() {
    try {
      const job = await this.leaderBoardQueue.add(
        LeaderboardJobs.RECALCULATE_ALL_RANKS,
        {},
        {
          priority: 2,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      );
      return getSuccessResponse(
        job.id,
        'Rank recalculation job queued successfully',
      );
    } catch (error) {
      return getFailureResponse(error);
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Post('create')
  async createLeaderboardCache() {
    try {
      const leaderboardData = await this.userStatService.getAllUsersSorted();

      const result = await this.leaderBoardService.create(leaderboardData);

      return getSuccessResponse(
        result,
        'Leaderboard cache created successfully',
      );
    } catch (error) {
      return getFailureResponse(error);
    }
  }
@Get('user/:userId/position')
async getUserPosition(@Param('userId') userId: string) {
  try {
    const userStats = await this.userStatService.findByUserId(userId);
    
    if (!userStats || userStats.data.totalPoints === 0) {
      return getSuccessResponse({
        ranked: false,
        totalPoints: 0,
        totalSolved: 0,
        message: 'Solve your first problem to get ranked!',
      }, 'User not ranked yet');
    }

    const totalRankedUsers = await this.userStatService.countRankedUsers();
    
    return getSuccessResponse({
      ranked: true,
      currentRank: userStats.data.currentRank,
      totalPoints: userStats.data.totalPoints,
      totalSolved: userStats.data.totalSolved,
      totalRankedUsers,
      percentile: ((totalRankedUsers - userStats.data.currentRank) / totalRankedUsers * 100).toFixed(1),
    }, 'User position retrieved');
    
  } catch (error) {
    return getFailureResponse(error);
  }
}
}
