import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class AuthDto {
	@Field()
  @IsEmail()
  email: string;

	@Field()
	@MinLength(6, {
		message: 'Password must be at least 6 characters long',
	})
	@IsString()
  password: string;
}