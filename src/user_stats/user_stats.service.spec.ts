import { Test, TestingModule } from '@nestjs/testing';
import { UserStatsService } from './user_stats.service';

describe('UserStatsService', () => {
  let service: UserStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStatsService],
    }).compile();

    service = module.get<UserStatsService>(UserStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
