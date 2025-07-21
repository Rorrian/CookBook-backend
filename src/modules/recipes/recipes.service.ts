import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateRecipeInput } from './dto/create-recipe.input';
import { UpdateRecipeInput } from './dto/update-recipe.input';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RecipesService {
	constructor(private readonly prisma: PrismaService) {}
	
  create(createRecipeInput: CreateRecipeInput) {
    return this.prisma.recipe.create({
      data: createRecipeInput,
    });
  }

  findAll() {
    return this.prisma.recipe.findMany({
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

  async findOne(id: string) {
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
			
			return recipe;
  }

  async update(id: string, updateRecipeInput: UpdateRecipeInput) {
		const existing = await this.findOne(id);

		if (!existing) throw new NotFoundException(`Recipe with id ${id} not found`);
		
		return this.prisma.recipe.update({ where: { id }, data: updateRecipeInput });
	}

  async remove(id: string) {
    const existing = await this.findOne(id);
    if (!existing) throw new NotFoundException(`Recipe with id ${id} not found`);
    
		await this.prisma.ingredient.deleteMany({ where: { recipe_id: id } });
		await this.prisma.step.deleteMany({ where: { recipe_id: id  } });
		
		return this.prisma.recipe.delete({ where: { id } });
  }
}