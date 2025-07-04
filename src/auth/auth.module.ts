import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from "@nestjs/passport";

import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AppConfig } from '../config/configuration';
import { UsersModule } from '@/modules/users/users.module';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AppConfig>) => {
        const secret = configService.get('JWT_SECRET');
        const expiresIn = configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN');
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
      inject: [ConfigService],
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
