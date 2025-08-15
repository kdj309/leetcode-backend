import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LeaderboardCacheService } from './leaderboard_cache.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGaurd } from 'src/roles/roles.guard';
import { SessionGuard } from 'src/sessiontoken/session.guard';
import { getFailureResponse, getSuccessResponse } from 'src/utils';
import { LeaderboardJobs } from 'src/interfaces/config.interface';

@Controller('leaderboard-cache')
export class LeaderboardCacheController {
  constructor(
    private readonly leaderBoardService: LeaderboardCacheService,
    @InjectQueue('leaderboard') private leaderBoardQueue: Queue,
  ) {}

  @UseGuards(AuthGuard, SessionGuard)
  @Get()
  async getLeaderBoard() {
    try {
      const stats = await this.leaderBoardService.getLeaderboard();
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
}
