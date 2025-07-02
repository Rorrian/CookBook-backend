import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

import { Recipe } from '@/modules/recipes/entities/recipe.entity';

@ObjectType()
export class Step {
	@Field(() => ID)
	id: string;
	
  @Field()
  description: string;

	@Field(() => Int)
	step_number: number;

  @Field()
  recipe_id: string;
	@Field(() => Recipe)
	recipe: Recipe;
}
