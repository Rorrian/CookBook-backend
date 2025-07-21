import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { PassportModule } from "@nestjs/passport";

import { UsersModule } from '@/modules/users/users.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AppConfig } from '../config/configuration';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => {
        const secret = configService.get('JWT_SECRET');
        const expiresIn = configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN');
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
		UsersModule,
	],
	providers: [
		JwtStrategy,
		PrismaService,
		AuthService,
		AuthResolver,
	],
  exports: [AuthService],
})
export class AuthModule {}
