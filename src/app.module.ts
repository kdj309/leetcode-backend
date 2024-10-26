import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProblemsModule } from './problems/problems.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config/config';
import { AuthModule } from './auth/auth.module';
import { RetrytokenModule } from './retrytoken/retrytoken.module';
import { SessiontokenController } from './sessiontoken/sessiontoken.controller';
import { SessiontokenService } from './sessiontoken/sessiontoken.service';
import { SessiontokenModule } from './sessiontoken/sessiontoken.module';

@Module({
  imports: [
    MongooseModule.forRoot(config().mongodb.database.connectionString),
    UsersModule,
    ProblemsModule,
    RetrytokenModule,
    AuthModule,
    SessiontokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
