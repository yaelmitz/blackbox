import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Investigation } from '../entities/investigation.entity';
import { UnitsService } from './units.service';

/**
 * One-time data migration: investigations used to store their unit as free text (column "unit").
 * On startup, every non-empty value becomes a row in "units" (one per distinct name) and is linked
 * to its investigation through investigation_units; the old column is then emptied.
 * Safe to run on every start: once migrated there is nothing left to move.
 */
@Injectable()
export class UnitMigrationService implements OnApplicationBootstrap {
  private readonly log = new Logger('UnitMigration');
  constructor(private readonly ds: DataSource, private readonly units: UnitsService) {}

  async onApplicationBootstrap() {
    const repo = this.ds.getRepository(Investigation);
    const rows = await repo
      .createQueryBuilder('i')
      .select(['i.id'])
      .addSelect('i.legacyUnit')
      .leftJoinAndSelect('i.units', 'u')
      .where("i.legacyUnit IS NOT NULL AND i.legacyUnit <> '' AND i.legacyUnit <> '—'")
      .getMany();
    if (!rows.length) return;

    for (const inv of rows) {
      const unit = await this.units.ensure(inv.legacyUnit!);
      if (!inv.units.some((u) => u.id === unit.id)) {
        await this.ds.createQueryBuilder().relation(Investigation, 'units').of(inv.id).add(unit.id);
      }
      await repo.update({ id: inv.id }, { legacyUnit: null });
    }
    this.log.log(`Moved the unit of ${rows.length} investigations into the units table`);
  }
}
