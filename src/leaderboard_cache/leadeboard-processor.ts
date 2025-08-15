import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UserStatsService } from 'src/user_stats/user_stats.service';
import { LeaderboardCacheService } from './leaderboard_cache.service';
import { LeaderboardJobs } from 'src/interfaces/config.interface';

@Processor('leaderboard')
export class LeaderboardProcessor extends WorkerHost {
  constructor(
    private userStatsService: UserStatsService,
    private leaderboardCacheService: LeaderboardCacheService
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case LeaderboardJobs.RECALCULATE_ALL_RANKS:
        return this.recalculateAllRanks(job);
      
      case LeaderboardJobs.UPDATE_LEADERBOARD_CACHE:
        return this.updateLeaderboardCache(job);
        
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  private async recalculateAllRanks(job: Job) {
    job.updateProgress(10);
    
    // Get all users sorted by points
    const users = await this.userStatsService.getAllUsersSorted();
    job.updateProgress(30);
    
    // Update ranks in batches
    const batchSize = 100;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await this.userStatsService.updateRanksBatch(batch, i);
      
      const progress = 30 + ((i / users.length) * 60);
      job.updateProgress(progress);
    }
    
    // Invalidate cache
    await this.leaderboardCacheService.invalidateCache();
    job.updateProgress(100);
    
    return { 
      message: `Updated ranks for ${users.length} users`,
      timestamp: new Date()
    };
  }

  private async updateLeaderboardCache(job: Job): Promise<any> {
  try {
    // Initial progress
    job.updateProgress(10);
    
    // Get fresh leaderboard data
    const users = await this.userStatsService.getAllUsersSorted();
    job.updateProgress(50);
    
    // Cache the data
    await this.leaderboardCacheService.create(users);
    job.updateProgress(90);
    
    // Final progress update
    job.updateProgress(100);
    
    return {
      message: 'Leaderboard cache updated successfully',
      usersCount: users.length,
      timestamp: new Date()
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
}