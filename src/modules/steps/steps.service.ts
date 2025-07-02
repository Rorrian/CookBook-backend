import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateStepInput } from './dto/create-step.input';
import { UpdateStepInput } from './dto/update-step.input';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class StepsService {
	constructor(private readonly prisma: PrismaService) {}
	
  async create(createStepInput: CreateStepInput) {
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
    const existing = await this.findOne(id);

    if (!existing) throw new NotFoundException(`Step with id ${id} not found`);
    
		return this.prisma.step.delete({ where: { id } });
  }
}
