import { Module } from '@nestjs/common';

import { StepsService } from './steps.service';
import { StepsResolver } from './steps.resolver';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
	imports: [PrismaModule],
  providers: [StepsResolver, StepsService],
})
export class StepsModule {}
