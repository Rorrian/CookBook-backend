import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

@InputType()
export class CreateRecipeInput {
	@Field()
	@IsNotEmpty()
	title: string;

	@Field({ nullable: true })
	@IsOptional()
	description?: string;

	@Field({ nullable: true })
	@IsOptional()
	@IsUrl()
	image_url?: string;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	complexity?: number;
		
	@Field({ nullable: true })
	@IsOptional()
	preparation_time?: string;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	servings_count?: number;


	@Field(() => Float, { nullable: true })
	@IsOptional()
	calories?: number;

	@Field(() => Float, { nullable: true })
	@IsOptional()
	proteins?: number;

	@Field(() => Float, { nullable: true })
	@IsOptional()
	fats?: number;

	@Field(() => Float, { nullable: true })
	@IsOptional()
	carbohydrates?: number;
	
	
	@Field()
	@IsNotEmpty()
	category_id: string;

	@Field()
	@IsNotEmpty()
	user_id: string;
}
