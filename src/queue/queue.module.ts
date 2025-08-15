import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from 'src/config/config';
const redisConnection = new Redis({
  host: config().redis.url,
  port: Number(config().redis.port),
  password: config().redis.password,
  tls: {
    rejectUnauthorized:false
  }
});
@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: config().redis.url,
        port: Number(config().redis.port),
        password:config().redis.password,
        tls:{
          rejectUnauthorized:false
        }
      },
    }),
    BullModule.registerQueue({
      name: 'leaderboard',
    }),
  ],
  providers: [
    {
      provide:"REDIS_CLIENT",
      useValue:redisConnection
    }
  ],
  exports: [BullModule,"REDIS_CLIENT"],
})
export class QueueModule {}