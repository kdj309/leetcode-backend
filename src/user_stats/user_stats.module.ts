import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserStat, UserStatSchema } from 'src/Schemas/userstat.schema';
import { UserStatsController } from './user_stats.controller';
import { UserStatsService } from './user_stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserStat.name,
        schema: UserStatSchema,
      },
    ]),
  ],
  controllers: [UserStatsController],
  providers: [UserStatsService],
  exports: [UserStatsService],
})
export class UserStatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
