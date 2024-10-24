import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RetrytokenController } from './retrytoken.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Retrytoken, RetryTokenSchema } from 'src/Schemas/retrytoken.schema';
import { RetrytokenService } from './retrytoken.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Retrytoken.name, schema: RetryTokenSchema },
    ]),
  ],
  controllers: [RetrytokenController],
  providers: [RetrytokenService],
  exports: [RetrytokenService],
})
export class RetrytokenModule implements NestModule {
  configure(_: MiddlewareConsumer) {}
}
