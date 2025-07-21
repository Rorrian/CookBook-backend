import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CurrentUserType } from '@/auth/types/current-user.type';
import { StepsService } from './steps.service';
import { Step } from './entities/step.entity';
import { CreateStepInput } from './dto/create-step.input';
import { UpdateStepInput } from './dto/update-step.input';

@Resolver(() => Step)
@UseGuards(JwtAuthGuard)
export class StepsResolver {
  constructor(private readonly stepsService: StepsService) {}

  @Mutation(() => Step)
  createStep(
		@Args('createStepInput') createStepInput: CreateStepInput,
    @CurrentUser() user: CurrentUserType,
	) {
    return this.stepsService.create(createStepInput, user);
  }

  @Query(() => [Step], { name: 'stepsByRecipe' })
  findAllByRecipe(
		@Args("recipeId", { type: () => ID }) recipeId: string,
    @CurrentUser() user: CurrentUserType,
	) {
    return this.stepsService.findAllByRecipe(recipeId, user);
  }

  @Query(() => Step, { name: 'step' })
  findOne(
		@Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: CurrentUserType,
	) {
    return this.stepsService.findOne(id, user);
  }

  @Mutation(() => Step)
  updateStep(
		@Args('updateStepInput') updateStepInput: UpdateStepInput,
    @CurrentUser() user: CurrentUserType,
	) {
    return this.stepsService.update(updateStepInput.id, updateStepInput, user);
  }

  @Mutation(() => Boolean)	
  async removeStep(
		@Args("id", { type: () => ID }) id: string,
    @CurrentUser() user: CurrentUserType,
	) {
    await this.stepsService.remove(id, user);
    return true;
  }
}
