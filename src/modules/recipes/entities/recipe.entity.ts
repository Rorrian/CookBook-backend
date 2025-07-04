import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { IsInt, IsOptional, IsUrl } from 'class-validator';

import { Category } from '@/modules/categories/entities/category.entity';
import { Ingredient } from '@/modules/ingredients/entities/ingredient.entity';
import { Step } from '@/modules/steps/entities/step.entity';
import { User } from '@/modules/users/entities/user.entity';

@ObjectType()
export class Recipe {
	@Field(() => ID)
	id: string;
	
  @Field()
  title: string;
	
	@Field({ nullable: true })
	@IsOptional()
  description?: string;

	@Field({ nullable: true })
	@IsOptional()
	@IsUrl()
  image_url?: string;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
  complexity?: number;
	
	@Field({ nullable: true })
	@IsOptional()
  preparation_time?: string;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
  servings_count?: number;


	@Field(() => Float, { nullable: true })
	@IsOptional()
  calories?: number;

	@Field(() => Float, { nullable: true })
	@IsOptional()
  proteins?: number;

	@Field(() => Float, { nullable: true })
	@IsOptional()
  fats?: number;

	@Field(() => Float, { nullable: true })
	@IsOptional()
  carbohydrates?: number;


  @Field()
  category_id: string;
	@Field(() => Category)
	category: Category;

  @Field()
  user_id: string;
	@Field(() => User)
	user: User;


	@Field(() => [Ingredient], { nullable: 'itemsAndList' })
	ingredients?: Ingredient[];
	
	@Field(() => [Step], { nullable: 'itemsAndList' })
	steps?: Step[];
}
