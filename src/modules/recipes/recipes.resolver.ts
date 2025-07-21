import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CurrentUserType } from '@/auth/types/current-user.type';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeInput } from './dto/create-recipe.input';
import { UpdateRecipeInput } from './dto/update-recipe.input';

@Resolver(() => Recipe)
@UseGuards(JwtAuthGuard)
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}

  @Mutation(() => Recipe)
  createRecipe(
		@Args('createRecipeInput') createRecipeInput: CreateRecipeInput,
		@CurrentUser() user: CurrentUserType,
	) {
    return this.recipesService.create(createRecipeInput, user);
  }

  @Query(() => [Recipe], { name: 'recipes' })
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.recipesService.findAll(user);
  }

  @Query(() => Recipe, { name: 'recipe' })
  findOne(
		@Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: CurrentUserType,
	) {
    return this.recipesService.findOne(id, user);
  }

  @Mutation(() => Recipe)
  updateRecipe(
		@Args('updateRecipeInput') updateRecipeInput: UpdateRecipeInput,
		@CurrentUser() user: CurrentUserType,
	) {
    return this.recipesService.update(updateRecipeInput.id, updateRecipeInput, user);
  }

  @Mutation(() => Boolean)
  async removeRecipe(
		@Args('id', { type: () => ID }) id: string,
		@CurrentUser() user: CurrentUserType,
	) {
    await this.recipesService.remove(id, user);
    return true;
  }
}
