import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateUnitInput {
  @Field()
  @IsNotEmpty()
  name: string;
}
