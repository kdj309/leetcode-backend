import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardCacheController } from './leaderboard_cache.controller';

describe('LeaderboardCacheController', () => {
  let controller: LeaderboardCacheController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardCacheController],
    }).compile();

    controller = module.get<LeaderboardCacheController>(
      LeaderboardCacheController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
