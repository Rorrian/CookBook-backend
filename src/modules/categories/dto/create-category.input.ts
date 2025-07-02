import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

@InputType()
export class CreateCategoryInput {
	@Field()
	@IsNotEmpty()
	title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
	image_url?: string;
}
