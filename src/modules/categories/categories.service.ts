import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoriesService {
	constructor(private readonly prisma: PrismaService) {}
	
  create(createCategoryInput: CreateCategoryInput) {
    return this.prisma.category.create({
      data: createCategoryInput,
    });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

		if (!category) throw new NotFoundException(`Category with id ${id} not found`);
		
		return category;
  }

  async update(id: string, updateCategoryInput: UpdateCategoryInput) {
		const existing = await this.findOne(id);

		if (!existing) throw new NotFoundException(`Category with id ${id} not found`);
		
		return this.prisma.category.update({ where: { id }, data: updateCategoryInput });
	}

  async remove(id: string, isCascade: boolean = false) {
    const existing = await this.findOne(id);
    if (!existing) throw new NotFoundException(`Category with id ${id} not found`);
    
		if (isCascade) {
			await this.prisma.recipe.deleteMany({ where: { category_id: id } });
		} else {
			const count = await this.prisma.recipe.count({ where: { category_id: id } });
			if (count > 0) throw new BadRequestException('Cannot delete category with linked recipes');
		}

		return this.prisma.category.delete({ where: { id } });
  }
}
