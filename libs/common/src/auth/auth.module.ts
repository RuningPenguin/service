import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@app/common';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [forwardRef(() => ConfigModule)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JTW_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JTW_EXPIRES_IN') }
      })
    })
  ],
  providers: [JwtStrategy, AuthService],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
