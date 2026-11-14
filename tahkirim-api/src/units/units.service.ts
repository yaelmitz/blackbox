import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { UnitDto } from './dto/unit.dto';

export const UNIT_JOIN_TABLE = 'investigation_units';

@Injectable()
export class UnitsService {
  constructor(@InjectRepository(Unit) private readonly units: Repository<Unit>) {}

  /** All units, alphabetical, with how many investigations use each */
  findAll() {
    return this.units
      .createQueryBuilder('u')
      .loadRelationCountAndMap('u.investigationCount', 'u.investigations')
      .orderBy('u.name', 'ASC')
      .getMany();
  }

  async findOne(id: number) {
    const unit = await this.units.findOneBy({ id });
    if (!unit) throw new NotFoundException(`Unit ${id} not found`);
    return unit;
  }

  async create(dto: UnitDto) {
    const name = dto.name.trim();
    if (await this.units.existsBy({ name })) throw new ConflictException(`Unit "${name}" already exists`);
    return this.units.save(this.units.create({ name }));
  }

  async update(id: number, dto: UnitDto) {
    const unit = await this.findOne(id);
    const name = dto.name.trim();
    const other = await this.units.findOneBy({ name });
    if (other && other.id !== id) throw new ConflictException(`Unit "${name}" already exists`);
    unit.name = name;
    return this.units.save(unit);
  }

  /** Deletes the unit and unlinks it from its investigations (the investigations stay). */
  async remove(id: number) {
    await this.units.manager.transaction(async (m) => {
      if (!(await m.existsBy(Unit, { id }))) throw new NotFoundException(`Unit ${id} not found`);
      // explicit: the file-based SQLite driver does not enforce foreign-key cascades
      await m.createQueryBuilder().delete().from(UNIT_JOIN_TABLE).where({ unitId: id }).execute();
      await m.delete(Unit, { id });
    });
  }

  /** Resolves ids sent by a client; every id must exist. */
  async byIds(ids: number[]) {
    const unique = [...new Set(ids)];
    if (!unique.length) return [];
    const found = await this.units.findBy({ id: In(unique) });
    const missing = unique.filter((id) => !found.some((u) => u.id === id));
    if (missing.length) throw new BadRequestException(`unitIds: unit ${missing.join(', ')} not found`);
    return found;
  }

  /** Find a unit by name, creating it if needed (used by the seed and the data migration). */
  async ensure(name: string) {
    const clean = name.trim();
    return (await this.units.findOneBy({ name: clean })) ?? this.units.save(this.units.create({ name: clean }));
  }
}
