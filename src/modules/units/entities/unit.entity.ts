import { ObjectType, Field, ID } from "@nestjs/graphql";

import { Ingredient } from "@/modules/ingredients/entities/ingredient.entity";

@ObjectType()
export class Unit {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [Ingredient], { nullable: true })
  ingredients?: Ingredient[];
}
