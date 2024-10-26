import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { RetrytokenModule } from 'src/retrytoken/retrytoken.module';
import { SessiontokenModule } from 'src/sessiontoken/sessiontoken.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    RetrytokenModule,
    SessiontokenModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
