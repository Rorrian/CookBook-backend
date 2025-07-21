import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngredientInput } from './dto/create-ingredient.input';
import { UpdateIngredientInput } from './dto/update-ingredient.input';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class IngredientsService {
	constructor(private readonly prisma: PrismaService) {}

  async create(createIngredientInput: CreateIngredientInput) {
    return this.prisma.ingredient.create({
      data: createIngredientInput,
    });
  }

  async findAll() {
    return this.prisma.ingredient.findMany({
			include: { unit: true }
		})
  }

  async findOne(id: string) {
		const ingredient = await this.prisma.ingredient.findUnique({
			where: { id },
			include: { unit: true },
		})

		if (!ingredient) throw new NotFoundException(`Ingredient with id ${id} not found`);

    return ingredient;
  }

  async update(id: string, updateUnitInput: UpdateIngredientInput) {
    const existing = await this.findOne(id);

    if (!existing) throw new NotFoundException(`Ingredient with id ${id} not found`);
    
		return this.prisma.ingredient.update({ where: { id }, data: updateUnitInput });
  }

  async remove(id: string) {
    const existing = await this.findOne(id);
    if (!existing) throw new NotFoundException(`Ingredient with id ${id} not found`);
    
		return this.prisma.ingredient.delete({ where: { id } });
  }
}
