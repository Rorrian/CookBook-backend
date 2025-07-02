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

    if (!unit) {
      throw new NotFoundException(`Unit with id ${id} not found`);
    }

    return unit;
  }

  async update(updateUnitInput: UpdateUnitInput) {
    const { id, ...data } = updateUnitInput;

    await this.findOne(id); // проверка существования

    return this.prisma.unit.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // проверка существования

    await this.prisma.unit.delete({
      where: { id },
    });
  }
}
