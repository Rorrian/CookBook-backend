import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { Roles } from '@/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver(() => Category)
@UseGuards(JwtAuthGuard)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category)
	@Roles('ADMIN')
  createCategory(@Args('createCategoryInput') createCategoryInput: CreateCategoryInput) {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Mutation(() => Category)
	@Roles('ADMIN')
  updateCategory(@Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput) {
    return this.categoriesService.update(updateCategoryInput.id, updateCategoryInput);
  }

  @Mutation(() => Boolean)
	@Roles('ADMIN')
  async removeCategory(
		@Args('id', { type: () => ID }) id: string,
		@Args('isCascade', { type: () => Boolean, nullable: true }) isCascade?: boolean,
	) {
    await this.categoriesService.remove(id, isCascade);
    return true;
  }
}
