import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from '../entities/attachment.entity';
import { Investigation } from '../entities/investigation.entity';
import { Recommendation } from '../entities/recommendation.entity';
import { UnitsModule } from '../units/units.module';
import { InvestigationsController, RecommendationsController } from './investigations.controller';
import { InvestigationsService } from './investigations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Investigation, Recommendation, Attachment]), UnitsModule],
  controllers: [InvestigationsController, RecommendationsController],
  providers: [InvestigationsService],
})
export class InvestigationsModule {}
