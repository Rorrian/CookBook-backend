import { CreateIngredientInput } from './create-ingredient.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateIngredientInput extends PartialType(CreateIngredientInput) {
  @Field(() => ID)
  id: string;
}
