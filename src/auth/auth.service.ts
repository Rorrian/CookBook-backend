import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AppConfig } from '../config/configuration';
import { AuthResponse } from './types';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService<AppConfig>,
  ) {}

  async register(dto: AuthDto): Promise<AuthResponse> {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN') },
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.refreshToken.create({
      data: {
        token: hashedRefreshToken,
        user_id: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async login(dto: AuthDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password ?? '');
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN') },
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.refreshToken.create({
      data: {
				token: hashedRefreshToken,
        user_id: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(dto: RefreshTokenDto): Promise<AuthResponse> {
    let payload: { sub: string; email: string };
    try {
      payload = this.jwtService.verify(dto.refreshToken);
      console.log('Payload:', payload);
    } catch (error) {
      console.error('JWT verification error:', error.message);
      throw new UnauthorizedException('Invalid refresh token');
    }

    // --- Проверка предоставленного токена - dto.refreshToken ---

    // Проверяем, есть ли запись в БД для dto.refreshToken
    const tokenRecords = await this.prisma.refreshToken.findMany({
      where: {
        user_id: payload.sub,
      },
    });

		// Ищем в БД запись, соответствующую dto.refreshToken
    let matchingTokenRecord: any = null;
    for (const record of tokenRecords) {
      const isMatch = await bcrypt.compare(dto.refreshToken, record.token);
      if (isMatch) {
        matchingTokenRecord = record;
        break;
      }
    }

    if (!matchingTokenRecord) {
      console.log('No token record matches provided token for user:', payload.sub);
      throw new UnauthorizedException('Invalid provided refresh token');
    }
    if (matchingTokenRecord.isRevoked) {
      console.log('Attempt to use revoked token for user:', payload.sub, 'Token ID:', matchingTokenRecord.id);
      throw new UnauthorizedException('Provided refresh token is revoked');
    }
    if (matchingTokenRecord.expiresAt < new Date()) {
      console.log('Attempt to use expired token for user:', payload.sub, 'Token ID:', matchingTokenRecord.id);
      throw new UnauthorizedException('Provided refresh token is expired');
    }

    // --- Проверка активных токенов --- 
    const activeTokens = await this.prisma.refreshToken.findMany({
      where: {
        user_id: payload.sub,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log('Active tokens found:', activeTokens.length, 'for user:', payload.sub);

    if (activeTokens.length === 0) {
      console.log('No valid refresh token found for user:', payload.sub);
      throw new UnauthorizedException('No valid refresh token found');
    }
    if (activeTokens.length > 1) {
      console.warn('Multiple active tokens found for user:', payload.sub, 'Revoking all...');
      await this.prisma.refreshToken.updateMany({
        where: { user_id: payload.sub, isRevoked: false },
        data: { isRevoked: true },
      });
      throw new UnauthorizedException('Multiple active tokens detected, all revoked');
    }

    const refreshTokenRecord = activeTokens[0];
    // Проверяем, что dto.refreshToken соответствует активному токену
    if (matchingTokenRecord.id !== refreshTokenRecord.id) {
      console.log(`
				Provided token does not match active token for user:, ${payload.sub},
				'Provided Token ID:', ${matchingTokenRecord.id},
				'Active Token ID:', ${refreshTokenRecord.id}
			`);
      throw new UnauthorizedException('Provided token is not the active refresh token');
    }

    // --- Новые токены --- 
    const accessToken = this.jwtService.sign({ sub: payload.sub, email: payload.email });
    const newRefreshToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email },
      { expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN') },
    );
    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    const result = await this.prisma.$transaction([
      this.prisma.refreshToken.update({
        where: { id: refreshTokenRecord.id },
        data: { isRevoked: true },
      }),
      this.prisma.refreshToken.create({
        data: {
          token: hashedNewRefreshToken,
          user_id: payload.sub,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
        },
      }),
    ]);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshTokenRecord = await this.prisma.refreshToken.findFirst({
      where: {
        user_id: payload.sub,
        expiresAt: { gt: new Date() },
        isRevoked: false,
      },
    });

		if (!refreshTokenRecord) {
      throw new UnauthorizedException('Refresh token not found or expired');
    }

		if (!(await bcrypt.compare(refreshToken, refreshTokenRecord.token))) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		await this.prisma.refreshToken.update({
			where: { id: refreshTokenRecord.id },
			data: { isRevoked: true },
		});

    return { message: 'Logged out successfully' };
  }
}