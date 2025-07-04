import { Module } from "@nestjs/common";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";

import { UnitsModule } from "./modules/units/units.module";
import { StepsModule } from './modules/steps/steps.module';
import { IngredientsModule } from "./modules/ingredients/ingredients.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { RecipesModule } from "./modules/recipes/recipes.module";
import { AuthModule } from "./auth/auth.module";
import { loadConfig } from "./config/configuration";

@Module({
  imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [loadConfig],
		}),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // playground: false,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
    }),
		// Модули
		AuthModule,
    UnitsModule,
    IngredientsModule,
    StepsModule,
    CategoriesModule,
    RecipesModule,
  ],
})
export class AppModule {}
