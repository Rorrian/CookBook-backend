import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsOptional, IsUrl } from 'class-validator';

import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {

	@Field({ nullable: true })
	@IsOptional()
	name?: string;
	
	@Field({ nullable: true })
	@IsOptional()
	@IsUrl()
	avatarPath?: string;
}
