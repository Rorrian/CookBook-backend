import { Module } from '@nestjs/common';

import { IngredientsService } from './ingredients.service';
import { IngredientsResolver } from './ingredients.resolver';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
	imports: [PrismaModule],
  providers: [IngredientsResolver, IngredientsService],
})
export class IngredientsModule {}
