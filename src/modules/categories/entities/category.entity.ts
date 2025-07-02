import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsUrl } from 'class-validator';

import { Recipe } from '@/modules/recipes/entities/recipe.entity';

@ObjectType()
export class Category {
	@Field(() => ID)
	id: string;

  @Field()
  title: string;

	@Field({ nullable: true })
	@IsOptional()
	@IsUrl()
  image_url?: string;

	@Field(() => [Recipe], { nullable: 'itemsAndList' })
	recipes?: Recipe[];
}
