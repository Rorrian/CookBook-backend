import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

import { CurrentUserType } from '@/auth/types/current-user.type';
import { CreateRecipeInput } from './dto/create-recipe.input';
import { UpdateRecipeInput } from './dto/update-recipe.input';

@Injectable()
export class RecipesService {
	constructor(private readonly prisma: PrismaService) {}

  private async checkAccess(recipeId: string, user: CurrentUserType) {
		const recipe = await this.prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) throw new NotFoundException(`Recipe with id ${recipeId} not found`);
    
		if (recipe.user_id !== user.userId) throw new ForbiddenException('Access denied');
  }

  async create(
		createRecipeInput: CreateRecipeInput,
		user: CurrentUserType,
	) {
    return this.prisma.recipe.create({
      data: {
				...createRecipeInput,
				user_id: user.userId,
			},
    });
  }

  async findAll(user: CurrentUserType) {
		// const isAdmin = Array.isArray(user.role) ? user.role.includes('ADMIN') : user.role === 'ADMIN';
		const isAdmin = true;

    return this.prisma.recipe.findMany({
			where: isAdmin ? {} : { user_id: user.userId },
			include: {
				category: true,
				user: true,
				ingredients: true,
				steps: {
					orderBy: { step_number: 'asc' },
				},
			},
			orderBy: { title: 'desc' },
		});
  }

  async findOne(
		id: string,
		user: CurrentUserType,
	) {
		const recipe = await this.prisma.recipe.findUnique({
			where: { id },
			include: {
				category: true,
				user: true,
				ingredients: true,
				steps: {
					orderBy: { step_number: 'asc' },
				},
			},
		});
		if (!recipe) throw new NotFoundException(`Recipe with id ${id} not found`);
		
		if (recipe.user_id !== user.userId) {
			throw new ForbiddenException('Access denied');
		}
		
		return recipe;
  }

  async update(
		id: string,
		updateRecipeInput: UpdateRecipeInput,
		user: CurrentUserType,
	) {
		await this.checkAccess(id, user);
		
		return this.prisma.recipe.update({ where: { id }, data: updateRecipeInput });
	}

  async remove(
		id: string,
		user: CurrentUserType,
	) {
		await this.checkAccess(id, user);

		await this.prisma.ingredient.deleteMany({ where: { recipe_id: id } });
		await this.prisma.step.deleteMany({ where: { recipe_id: id  } });
		
		return this.prisma.recipe.delete({ where: { id } });
  }
}