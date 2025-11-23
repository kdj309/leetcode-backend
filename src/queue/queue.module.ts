import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { config } from 'src/config/config';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: config().redis.url,
        port: Number(config().redis.port),
        password: config().redis.password,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        commandTimeout: 30000,
        connectTimeout: 30000,
        keepAlive: 30000,
        lazyConnect: false
      },
    }),
    BullModule.registerQueue({
      name: 'leaderboard',
    }),
  ],
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: async () => {
        const redisConnection = createClient({
          password: config().redis.password,
          socket: {
            host: config().redis.url,
            port: Number(config().redis.port),
            reconnectStrategy: (retries) => {
              if (retries > 10) {
                return new Error('Too many retries');
              }
              return Math.min(retries * 100, 3000);
            },
            connectTimeout: 30000,
          }, commandsQueueMaxLength: 1000
        });
        await redisConnection.connect();

        // Event listeners
        redisConnection.on('error', (err) => {
          console.error('❌ Redis Client Error:', err);
        });

        redisConnection.on('connect', () => {
          console.log('✅ Redis Client Connected');
        });

        redisConnection.on('ready', () => {
          console.log('✅ Redis Client Ready');
        });

        redisConnection.on('reconnecting', () => {
          console.log('🔄 Redis Client Reconnecting...');
        });

        redisConnection.on('end', () => {
          console.log('🔌 Redis Client Connection Closed');
        });
        return redisConnection;
      }
    }
  ],
  exports: [BullModule, "REDIS_CLIENT"],
})
export class QueueModule { }