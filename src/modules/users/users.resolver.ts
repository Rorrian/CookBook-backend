import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ForbiddenException, UseGuards } from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
	// @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'userByID' })
  findOne(
		@Args('id', { type: () => ID }) id: string,
		@CurrentUser() user: { userId: string; email: string },
	) {
		if (user.userId !== id) {
			throw new ForbiddenException('Access denied');
		}

    return this.usersService.findOne(id);
  }

  @Query(() => User, { name: 'userByEmail' })
  findByEmail(
		@Args('email', { type: () => String }) email: string,
		@CurrentUser() user: { userId: string; email: string },
	) {
		if (user.email !== email) {
			throw new ForbiddenException('Access denied');
		}
    return this.usersService.findByEmail(email);
  }

  @Mutation(() => User)
  updateUser(
		@Args('updateUserInput') updateUserInput: UpdateUserInput,
		@CurrentUser() user: { userId: string; email: string },
	) {
    return this.usersService.update(user.userId, updateUserInput);
  }

  @Mutation(() => Boolean)
  async removeUser(
		@Args('id', { type: () => ID }) id: string,
		@CurrentUser() user: { userId: string; email: string },
	) {
		//TODO: if (user.userId !== id /* && !userIsAdmin */) { + в остальных запросах
		if (user.userId !== id) {
			throw new ForbiddenException('You can only delete your own account');
		}

		await this.usersService.remove(id);
    return true;
  }
}
