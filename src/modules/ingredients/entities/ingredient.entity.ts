import { Unit } from '@/modules/units/entities/unit.entity';
import { ObjectType, Field, Float, ID } from '@nestjs/graphql';

@ObjectType()
export class Ingredient {
	@Field(() => ID)
	id: string;

  @Field()
  name: string;

  @Field(() => Float)
  quantity: number;

	@Field()
  unit_id: string;
	@Field(() => Unit, { nullable: true })
  unit?: Unit;

  @Field()
  recipe_id: string;
}
