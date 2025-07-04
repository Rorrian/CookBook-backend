import { CreateStepInput } from './create-step.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateStepInput extends PartialType(CreateStepInput) {
  @Field(() => ID)
  id: string;
}
