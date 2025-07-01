import { Module } from '@nestjs/common';
import { IngredientsService } from './Ingredients.service';
import { IngredientsController } from './Ingredients.controller';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
export class IngredientsModule {}
