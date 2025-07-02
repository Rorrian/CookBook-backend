import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

@InputType()
export class CreateStepInput {
	@Field()
	@IsNotEmpty()
	description: string;

	@Field(() => Int)
  @IsInt()
  @Min(1)
	step_number: number;

	@Field()
	@IsNotEmpty()
	recipe_id: string;
}
