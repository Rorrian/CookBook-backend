import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "prisma/prisma.service";
import { CreateUnitInput } from "./dto/create-unit.input";
import { UpdateUnitInput } from "./dto/update-unit.input";

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUnitInput: CreateUnitInput) {
    return this.prisma.unit.create({
      data: createUnitInput,
    });
  }

	// TODO: отвязать единицы изменений от ингредиентов - они общие для всего приложения
  async findAll() {
    return this.prisma.unit.findMany({
      include: { ingredients: true },
    });
  }

  async findOne(id: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include: { ingredients: true },
    });

    if (!unit) throw new NotFoundException(`Unit with id ${id} not found`);
    
		return unit;
  }

	async update(id: string, updateUnitInput: UpdateUnitInput) {
		const existing = await this.findOne(id);

		if (!existing) throw new NotFoundException(`Unit with id ${id} not found`);
		
		return this.prisma.unit.update({ where: { id }, data: updateUnitInput });
	}

	async remove(id: string) {
    const existing = await this.findOne(id);

    if (!existing) throw new NotFoundException(`Unit with id ${id} not found`);
    
		return this.prisma.unit.delete({ where: { id } });
  }
}
