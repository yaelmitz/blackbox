import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from '../entities/unit.entity';
import { UnitMigrationService } from './unit-migration.service';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

@Module({
  imports: [TypeOrmModule.forFeature([Unit])],
  controllers: [UnitsController],
  providers: [UnitsService, UnitMigrationService],
  exports: [UnitsService],
})
export class UnitsModule {}
