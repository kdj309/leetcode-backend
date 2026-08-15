import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardCacheService } from './leaderboard_cache.service';

describe('LeaderboardCacheService', () => {
  let service: LeaderboardCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaderboardCacheService],
    }).compile();

    service = module.get<LeaderboardCacheService>(LeaderboardCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
