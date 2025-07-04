import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

	async findOne(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) throw new NotFoundException(`User with id ${id} not found`);
		
		return user;
	}

  async findByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: { email },
		});

		if (!user) throw new NotFoundException(`User with id ${email} not found`);
		
		return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
		const existing = await this.findOne(id);

		if (!existing) throw new NotFoundException(`User with id ${id} not found`);
		
		return this.prisma.user.update({ where: { id }, data: updateUserInput });
	}

  async remove(id: string) {
    const existing = await this.findOne(id);

    if (!existing) throw new NotFoundException(`User with id ${id} not found`);
    
		return this.prisma.user.delete({ where: { id } });
  }
}
