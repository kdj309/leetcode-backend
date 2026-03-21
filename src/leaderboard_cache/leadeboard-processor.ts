import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UserStatsService } from 'src/user_stats/user_stats.service';
import { LeaderboardCacheService } from './leaderboard_cache.service';
import { LeaderboardJobs } from 'src/interfaces/config.interface';
import { Logger } from '@nestjs/common';

@Processor('leaderboard', {
  concurrency: 1,
  limiter: {
    max: 10,
    duration: 60000,
  },
})
export class LeaderboardProcessor extends WorkerHost {
  private readonly logger = new Logger(LeaderboardProcessor.name);

  constructor(
    private userStatsService: UserStatsService,
    private leaderboardCacheService: LeaderboardCacheService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    this.logger.log(`Processing job: ${job.name} (ID: ${job.id})`);
    try {
      switch (job.name) {
        case LeaderboardJobs.RECALCULATE_ALL_RANKS:
          return this.recalculateAllRanks(job);

        case LeaderboardJobs.UPDATE_LEADERBOARD_CACHE:
          return this.updateLeaderboardCache(job);

        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(
        `Job ${job.name} failed: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async recalculateAllRanks(job: Job) {
    job.updateProgress(10);

    const users = await this.userStatsService.getAllUsersSorted(false);
    job.updateProgress(30);

    const batchSize = 100;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await this.userStatsService.updateRanksBatch(batch, i);

      const progress = 30 + (i / users.length) * 60;
      job.updateProgress(progress);
    }

    try {
      await this.leaderboardCacheService.invalidateCache();
      this.logger.log('Cache invalidated successfully');
      job.updateProgress(85);
    } catch (cacheError) {
      this.logger.warn(
        'Cache invalidation failed, but continuing:',
        cacheError,
      );
    }
    this.logger.log('Creating fresh cache...');
    try {
      const freshUsers = await this.userStatsService.getAllUsersSorted();
      await this.leaderboardCacheService.create(freshUsers);
      this.logger.log('✅ Fresh cache created successfully');
    } catch (cacheError) {
      this.logger.error('❌ Failed to create cache:', cacheError);
    }
    job.updateProgress(100);

    return {
      message: `Updated ranks for ${users.length} users`,
      timestamp: new Date(),
    };
  }

  private async updateLeaderboardCache(job: Job): Promise<any> {
    try {
      job.updateProgress(10);

      const users = await this.userStatsService.getAllUsersSorted();
      job.updateProgress(50);

      await this.leaderboardCacheService.create(users);
      job.updateProgress(90);

      job.updateProgress(100);

      return {
        message: 'Leaderboard cache updated successfully',
        usersCount: users.length,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to update leaderboard cache: ${error.message}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.name} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(`Job ${job.name} failed:`, err.message);
  }
  @OnWorkerEvent('error')
  onError(err: Error) {
    this.logger.error(`Worker error: ${err.message}`);
  }
}
