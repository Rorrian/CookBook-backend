import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

import { CurrentUserType } from '@/auth/types/current-user.type';
import { CreateStepInput } from './dto/create-step.input';
import { UpdateStepInput } from './dto/update-step.input';

@Injectable()
export class StepsService {
	constructor(private readonly prisma: PrismaService) {}

	// FIXME: вынести т.к. повторяется тут  и в ингредиентах, в рецептах
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
		createStepInput: CreateStepInput,
		user: CurrentUserType,
	) {
		await this.checkAccess(createStepInput.recipe_id, user);

		const existingStep = await this.prisma.step.findFirst({
			where: {
				step_number: createStepInput.step_number,
				recipe_id: createStepInput.recipe_id
			},
		});
		if(existingStep) {
			await this.prisma.step.updateMany({
				where: {
					recipe_id: createStepInput.recipe_id,
					step_number: { gte: createStepInput.step_number	}
				},
					data: {
						step_number: {
							increment: 1,
						}
					},
			})
		}

    return this.prisma.step.create({
      data: createStepInput,
    });
  }

  async findAllByRecipe(
		recipeId: string,
		user: CurrentUserType,
	) {
		await this.checkAccess(recipeId, user);

    return this.prisma.step.findMany({
			where: { recipe_id: recipeId },
			orderBy: { step_number: 'asc' },
    });
  }

  async findOne(
		id: string,
		user: CurrentUserType,
	) {
		const step = await this.prisma.step.findUnique({
			where: { id },
		});
		if (!step) throw new NotFoundException(`Step with id ${id} not found`);

		await this.checkAccess(step.recipe_id, user);

		return step;
  }

  async update(
		id: string,
		updateStepInput: UpdateStepInput,
		user: CurrentUserType,
	) {
		await this.findOne(id, user);
		
		return this.prisma.step.update({ where: { id }, data: updateStepInput });
	}

  async remove(
		id: string,
		user: CurrentUserType,
	) {
    const existingStep = await this.findOne(id, user);
    
		await this.prisma.step.updateMany({
      where: {
        recipe_id: existingStep.recipe_id,
        step_number: { gt: existingStep.step_number },
      },
      data: {
        step_number: { decrement: 1 },
      },
    });
    
		return this.prisma.step.delete({ where: { id } });
  }
}
