import { Module } from '@nestjs/common';

import { IngredientsModule } from './Ingredients/Ingredients.module';

@Module({
  imports: [IngredientsModule],
})
export class AppModule {}
