import { Controller } from '@nestjs/common';
import { IngredientsService } from './Ingredients.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly IngredientsService: IngredientsService) {}
}
