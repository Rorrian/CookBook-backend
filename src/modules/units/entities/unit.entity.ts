import { ObjectType, Field, ID } from "@nestjs/graphql";

import { Ingredient } from "src/modules/ingredients/ingredients.types";

@ObjectType()
export class Unit {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => [Ingredient], { nullable: true })
  ingredients?: Ingredient[];
}
