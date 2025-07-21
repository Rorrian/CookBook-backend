import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

import { CurrentUserType } from '@/auth/types/current-user.type';
import { CreateIngredientInput } from './dto/create-ingredient.input';
import { UpdateIngredientInput } from './dto/update-ingredient.input';

@Injectable()
export class IngredientsService {
	constructor(private readonly prisma: PrismaService) {}

	private async checkAccess(
		recipeId: string,
		user: CurrentUserType,
	) {
		const recipe = await this.prisma.recipe.findUnique({ where: { id: recipeId } });
		if (!recipe) throw new NotFoundException(`Recipe with id ${recipeId} not found`);

		if (recipe.user_id !== user.userId) {
			throw new ForbiddenException('Access denied');
		}
	}

  async create(
		createIngredientInput: CreateIngredientInput,
		user: CurrentUserType,
	) {
		await this.checkAccess(createIngredientInput.recipe_id, user);

    return this.prisma.ingredient.create({
      data: createIngredientInput,
    });
  }

  async findAllByRecipe(
		recipeId: string,
		user: CurrentUserType,
	) {
		await this.checkAccess(recipeId, user);

    return this.prisma.ingredient.findMany({
			where: { recipe_id: recipeId },
			include: { unit: true }
		})
  }

  async findOne(
		id: string,
		user: CurrentUserType,
	) {
		const ingredient = await this.prisma.ingredient.findUnique({
			where: { id },
			include: { unit: true },
		})
		if (!ingredient) throw new NotFoundException(`Ingredient with id ${id} not found`);
		
		await this.checkAccess(ingredient.recipe_id, user);

    return ingredient;
  }

  async update(
		id: string,
		updateUnitInput: UpdateIngredientInput,
		user: CurrentUserType,
	) {
    await this.findOne(id, user);
        
		return this.prisma.ingredient.update({ where: { id }, data: updateUnitInput });
  }

  async remove(
		id: string,
		user: CurrentUserType,
	) {
    await this.findOne(id, user);
        
		return this.prisma.ingredient.delete({ where: { id } });
  }
}
