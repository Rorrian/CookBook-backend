import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";

import { UnitsService } from "./units.service";
import { Unit } from "./entities/unit.entity";
import { CreateUnitInput } from "./dto/create-unit.input";
import { UpdateUnitInput } from "./dto/update-unit.input";

@Resolver(() => Unit)
export class UnitsResolver {
  constructor(private readonly unitsService: UnitsService) {}

  @Mutation(() => Unit)
  createUnit(@Args("createUnitInput") createUnitInput: CreateUnitInput) {
    return this.unitsService.create(createUnitInput);
  }

  @Query(() => [Unit], { name: "units" })
  findAll() {
    return this.unitsService.findAll();
  }

  @Query(() => Unit, { name: "unit" })
  findOne(@Args("id", { type: () => ID }) id: string) {
    return this.unitsService.findOne(id);
  }

	@Mutation(() => Unit)
	updateUnit(@Args('updateUnitInput') updateUnitInput: UpdateUnitInput) {
		return this.unitsService.update(updateUnitInput.id, updateUnitInput);
	}

  @Mutation(() => Boolean)
  async removeUnit(@Args("id", { type: () => ID }) id: string) {
    await this.unitsService.remove(id);
    return true;
  }
}
