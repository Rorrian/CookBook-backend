import { Module } from "@nestjs/common";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";

import { UnitsModule } from "./modules/units/units.module";
import { StepsModule } from './modules/steps/steps.module';
import { IngredientsModule } from "./modules/ingredients/ingredients.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { RecipesModule } from "./modules/recipes/recipes.module";
import { UsersModule } from "./modules/users/users.module";

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
    UsersModule,
  ],
})
export class AppModule {}
