import { Module } from "@nestjs/common";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { UnitsModule } from "./modules/units/units.module";
import { StepsModule } from './modules/steps/steps.module';
import { IngredientsModule } from "./modules/ingredients/ingredients.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { RecipesModule } from "./modules/recipes/recipes.module";
import { AuthModule } from "./auth/auth.module";
import { loadConfig } from "./config/configuration";
import { RolesGuard } from "./auth/guards/roles.guard";

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
      context: ({ req }) => ({ req }),
    }),
		// Модули
		AuthModule,
    UnitsModule,
    IngredientsModule,
    StepsModule,
    CategoriesModule,
    RecipesModule,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
