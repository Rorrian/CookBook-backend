import { Module } from "@nestjs/common";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";

import { UnitsModule } from "./modules/units/units.module";
import { StepsModule } from './modules/steps/steps.module';
import { IngredientsModule } from "./modules/ingredients/ingredients.module";
import { CategoriesModule } from './categories/categories.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // playground: false,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
    }),
		// Модули
    UnitsModule,
    IngredientsModule,
    StepsModule,
    CategoriesModule,
    RecipesModule,
  ],
})
export class AppModule {}
