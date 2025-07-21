import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CurrentUserType } from '@/auth/types/current-user.type';
import { IngredientsService } from './ingredients.service';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientInput } from './dto/create-ingredient.input';
import { UpdateIngredientInput } from './dto/update-ingredient.input';

@Resolver(() => Ingredient)
@UseGuards(JwtAuthGuard)
export class IngredientsResolver {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Mutation(() => Ingredient)
  createIngredient(
		@Args('createIngredientInput') createIngredientInput: CreateIngredientInput,
		@CurrentUser() user: CurrentUserType,
	) {
    return this.ingredientsService.create(createIngredientInput, user);
  }

	@Query(() => [Ingredient], { name: "ingredientsByRecipe" })
  findAllByRecipe(
		@Args('recipeId', { type: () => ID }) recipeId: string,
    @CurrentUser() user: CurrentUserType,
	) {
    return this.ingredientsService.findAllByRecipe(recipeId, user);
  }

	@Query(() => Ingredient, { name: "ingredient" })
  findOne(
		@Args("id", { type: () => ID }) id: string,
    @CurrentUser() user: CurrentUserType,
	) {
    return this.ingredientsService.findOne(id, user);
  }

  @Mutation(() => Ingredient)
  updateIngredient(
		@Args('updateIngredientInput') updateIngredientInput: UpdateIngredientInput,
    @CurrentUser() user: CurrentUserType,
	) {
    return this.ingredientsService.update(updateIngredientInput.id, updateIngredientInput, user);
  }

  @Mutation(() => Boolean)
  async removeIngredient(
		@Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: CurrentUserType,
	) {
		await this.ingredientsService.remove(id, user);
    return true;
  }
}
