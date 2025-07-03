import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsUrl } from 'class-validator';

import { Recipe } from '@/modules/recipes/entities/recipe.entity';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class User {
	@Field(() => ID)
	id: string;
	
  @Field()
	@IsEmail()
  email: string;

	@Field({ nullable: true })
	@IsOptional()
  name?: string;

	@Field({ nullable: true })
	@IsOptional()
	@IsUrl()
  avatarPath?: string;

	@Field(() => [Role])
	rights: Role[];
	
	@Field(() => [Recipe], { nullable: 'itemsAndList' })
	recipes?: Recipe[];
}
