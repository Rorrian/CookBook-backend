import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateIngredientInput {
	@Field()
	@IsNotEmpty()
	name: string;

	@Field(() => Float)
	@IsNotEmpty()
	quantity: number;

	@Field()
	@IsNotEmpty()
	unit_id: string;

	@Field()
	@IsNotEmpty()
	recipe_id: string;
}
