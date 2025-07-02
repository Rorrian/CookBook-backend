import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StepsService } from './steps.service';
import { Step } from './entities/step.entity';
import { CreateStepInput } from './dto/create-step.input';
import { UpdateStepInput } from './dto/update-step.input';

@Resolver(() => Step)
export class StepsResolver {
  constructor(private readonly stepsService: StepsService) {}

  @Mutation(() => Step)
  createStep(@Args('createStepInput') createStepInput: CreateStepInput) {
    return this.stepsService.create(createStepInput);
  }

  @Query(() => [Step], { name: 'stepsByRecipe' })
  findAllByRecipe(@Args("recipeId", { type: () => String }) recipeId: string) {
    return this.stepsService.findAllByRecipe(recipeId);
  }

  @Query(() => Step, { name: 'step' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.stepsService.findOne(id);
  }

  @Mutation(() => Step)
  updateStep(@Args('updateStepInput') updateStepInput: UpdateStepInput) {
    return this.stepsService.update(updateStepInput.id, updateStepInput);
  }

  @Mutation(() => Boolean)	
  async removeStep(@Args("id", { type: () => String }) id: string) {
    await this.stepsService.remove(id);
    return true;
  }
}
