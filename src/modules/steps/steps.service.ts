import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateStepInput } from './dto/create-step.input';
import { UpdateStepInput } from './dto/update-step.input';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class StepsService {
	constructor(private readonly prisma: PrismaService) {}
	
  async create(createStepInput: CreateStepInput) {
		const recipeExists = await this.prisma.recipe.findUnique({
			where: { id: createStepInput.recipe_id },
		});

		if(!recipeExists) {
			throw new NotFoundException(`Recipe with id ${createStepInput.recipe_id} not found`);
		}

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

  async findAllByRecipe(recipeId: string) {
    return this.prisma.step.findMany({
			where: { recipe_id: recipeId },
			orderBy: { step_number: 'asc' },
    });
  }

  async findOne(id: string) {
			const step = await this.prisma.step.findUnique({
				where: { id },
			});
	
			if (!step) throw new NotFoundException(`Step with id ${id} not found`);
	
			return step;
  }

  async update(id: string, updateStepInput: UpdateStepInput) {
		const existing = await this.findOne(id);
		
		if (!existing) throw new NotFoundException(`Step with id ${id} not found`);
		
		return this.prisma.step.update({ where: { id }, data: updateStepInput });
	}

  async remove(id: string) {
    const existingStep = await this.findOne(id);

    if (!existingStep) throw new NotFoundException(`Step with id ${id} not found`);

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
