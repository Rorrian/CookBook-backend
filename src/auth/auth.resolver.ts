import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { AuthResponse } from './types';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthDto } from './dto/auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('input') dto: AuthDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: AuthDto): Promise<AuthResponse> {
    return this.authService.login(input);
  }

  @Mutation(() => AuthResponse)
  async refreshToken(@Args('input') input: RefreshTokenDto): Promise<AuthResponse> {
    return this.authService.refreshToken(input);
  }

  @Mutation(() => String)
  async logout(@Args('refreshToken') refreshToken: string): Promise<string> {
    return (await this.authService.logout(refreshToken)).message;
  }
}