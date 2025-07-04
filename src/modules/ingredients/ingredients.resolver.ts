import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { IngredientsService } from './ingredients.service';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientInput } from './dto/create-ingredient.input';
import { UpdateIngredientInput } from './dto/update-ingredient.input';

@Resolver(() => Ingredient)
export class IngredientsResolver {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Mutation(() => Ingredient)
  createIngredient(@Args('createIngredientInput') data: CreateIngredientInput) {
    return this.ingredientsService.create(data);
  }

	@Query(() => [Ingredient], { name: "ingredients" })
  findAll() {
    return this.ingredientsService.findAll();
  }

	@Query(() => Ingredient, { name: "ingredient" })
  findOne(@Args("id", { type: () => ID }) id: string) {
    return this.ingredientsService.findOne(id);
  }

  @Mutation(() => Ingredient)
  updateIngredient(@Args('updateIngredientInput') updateIngredientInput: UpdateIngredientInput) {
    return this.ingredientsService.update(updateIngredientInput.id, updateIngredientInput);
  }

  @Mutation(() => Boolean)
  async removeIngredient(@Args('id', { type: () => ID }) id: string) {
		await this.ingredientsService.remove(id);
    return true;
  }

  // Вычисляемое поле unit_name через связанный unit
  // @ResolveField(() => String, { nullable: true })
  // unit_name(@Parent() ingredient: Ingredient) {
  //   return ingredient.unit?.name ?? null;
  // }
}
