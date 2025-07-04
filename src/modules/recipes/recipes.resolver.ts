import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeInput } from './dto/create-recipe.input';
import { UpdateRecipeInput } from './dto/update-recipe.input';

@Resolver(() => Recipe)
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}

  @Mutation(() => Recipe)
  createRecipe(@Args('createRecipeInput') createRecipeInput: CreateRecipeInput) {
    return this.recipesService.create(createRecipeInput);
  }

  @Query(() => [Recipe], { name: 'recipes' })
  findAll() {
    return this.recipesService.findAll();
  }

  @Query(() => Recipe, { name: 'recipe' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.recipesService.findOne(id);
  }

  @Mutation(() => Recipe)
  updateRecipe(@Args('updateRecipeInput') updateRecipeInput: UpdateRecipeInput) {
    return this.recipesService.update(updateRecipeInput.id, updateRecipeInput);
  }

  @Mutation(() => Boolean)
  async removeRecipe(@Args('id', { type: () => ID }) id: string) {
    await this.recipesService.remove(id);
    return true;
  }
}
