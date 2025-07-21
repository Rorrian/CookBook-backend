import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ForbiddenException, UseGuards } from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Roles } from '@/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { CurrentUserType } from '@/auth/types/current-user.type';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
	@Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'userByID' })
  findOne(
		@Args('id', { type: () => ID }) id: string,
		@CurrentUser() user: CurrentUserType,
	) {
		if (user.userId !== id) {
			throw new ForbiddenException('Access denied');
		}

    return this.usersService.findOne(id);
  }

  @Query(() => User, { name: 'userByEmail' })
  findByEmail(
		@Args('email', { type: () => String }) email: string,
		@CurrentUser() user: CurrentUserType,
	) {
		if (user.email !== email) {
			throw new ForbiddenException('Access denied');
		}
    return this.usersService.findByEmail(email);
  }

  @Mutation(() => User)
  updateUser(
		@Args('updateUserInput') updateUserInput: UpdateUserInput,
		@CurrentUser() user: CurrentUserType,
	) {
    return this.usersService.update(user.userId, updateUserInput);
  }

  @Mutation(() => Boolean)
  async removeUser(
		@Args('id', { type: () => ID }) id: string,
		@CurrentUser() user: CurrentUserType,
	) {
		//TODO: if (user.userId !== id /* && !userIsAdmin */) { + в остальных запросах
		if (user.userId !== id) {
			throw new ForbiddenException('You can only delete your own account');
		}

		await this.usersService.remove(id);
    return true;
  }
}
