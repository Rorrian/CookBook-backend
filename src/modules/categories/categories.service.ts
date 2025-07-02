import { Injectable, NotFoundException } from '@nestjs/common';

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

  async remove(id: string) {
    const existing = await this.findOne(id);

    if (!existing) throw new NotFoundException(`Category with id ${id} not found`);
    
		return this.prisma.category.delete({ where: { id } });
  }
}
