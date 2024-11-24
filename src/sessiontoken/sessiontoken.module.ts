import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionToken, SessionTokenSchema } from 'src/Schemas/session.schema';
import { SessiontokenController } from './sessiontoken.controller';
import { SessiontokenService } from './sessiontoken.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SessionToken.name, schema: SessionTokenSchema },
    ]),
  ],
  controllers: [SessiontokenController],
  providers: [SessiontokenService],
  exports: [SessiontokenService],
})
export class SessiontokenModule {}
