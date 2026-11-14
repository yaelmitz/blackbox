import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { deleteLessonsCascade } from '../common/cascade';
import { UNIT_JOIN_TABLE, UnitsService } from '../units/units.service';
import { Paged, pageArgs, paged } from '../common/pagination';
import { LessonStatus } from '../common/enums';
import { Attachment } from '../entities/attachment.entity';
import { Investigation } from '../entities/investigation.entity';
import { Lesson } from '../entities/lesson.entity';
import { Recommendation } from '../entities/recommendation.entity';
import {
  CreateInvestigationDto,
  InvestigationQueryDto,
  RecommendationDto,
  UpdateInvestigationDto,
  UpdateRecommendationDto,
} from './dto/investigation.dto';

type TextOrFileKey = 'location' | 'coordinates' | 'sources';
const TEXT_OR_FILE: TextOrFileKey[] = ['location', 'coordinates', 'sources'];

/** same limit as CreateLessonDto.name */
const LESSON_NAME_MAX = 200;

@Injectable()
export class InvestigationsService {
  constructor(
    @InjectRepository(Investigation) private readonly investigations: Repository<Investigation>,
    @InjectRepository(Recommendation) private readonly recommendations: Repository<Recommendation>,
    @InjectRepository(Attachment) private readonly attachments: Repository<Attachment>,
    private readonly units: UnitsService,
  ) {}

  /**
   * One page of the investigations table: מספר, נושא, תאריך, סוג, מסגרות, סיווג, מפרסם (+ lesson count).
   * Filters and sorting run on the server so pages stay consistent.
   */
  async findAll(query: InvestigationQueryDto): Promise<Paged<Investigation>> {
    const { page, pageSize, skip, take } = pageArgs(query);
    const qb = this.investigations
      .createQueryBuilder('i')
      .select(['i.id', 'i.subject', 'i.date', 'i.type', 'i.classification', 'i.publisher'])
      .leftJoin('i.units', 'u')
      .addSelect(['u.id', 'u.name'])
      .loadRelationCountAndMap('i.lessonCount', 'i.lessons');

    // ids of investigations linked to a unit matching a condition (keeps all of a row's units in the result)
    const withUnit = (alias: string, cond: string) => (w: typeof qb) =>
      'i.id IN ' + w.subQuery().select(`${alias}_i.id`).from(Investigation, `${alias}_i`).innerJoin(`${alias}_i.units`, `${alias}_u`).where(cond).getQuery();

    if (query.q?.trim()) {
      const q = `%${query.q.trim().toLowerCase()}%`;
      qb.andWhere(
        new Brackets((b) =>
          b
            .where('CAST(i.id AS TEXT) LIKE :q', { q })
            .orWhere('LOWER(i.subject) LIKE :q')
            .orWhere('LOWER(i.publisher) LIKE :q')
            .orWhere(withUnit('qu', 'LOWER(qu_u.name) LIKE :q')(qb)),
        ),
      );
    }
    if (query.type) qb.andWhere('i.type = :type', { type: query.type });
    if (query.classification) qb.andWhere('i.classification = :cls', { cls: query.classification });
    if (query.unitId) qb.andWhere(withUnit('fu', 'fu_u.id = :unitId')(qb), { unitId: query.unitId });

    const sort = query.sort ?? 'date';
    qb.orderBy(`i.${sort}`, query.order ?? 'DESC');
    // stable order between pages (a second key on the same column would override the first)
    if (sort !== 'id') qb.addOrderBy('i.id', 'DESC');
    const [items, total] = await qb.skip(skip).take(take).getManyAndCount();
    items.forEach((i) => i.units.sort((a, b) => a.name.localeCompare(b.name, 'he')));
    return paged(items, total, page, pageSize);
  }

  /** Values for the filter lists: every unit (id + name), alphabetical. */
  async filterOptions() {
    return { units: await this.units.findAll() };
  }

  /** Next free investigation number (suggested in the create form). */
  async nextId() {
    const row = await this.investigations.createQueryBuilder('i').select('MAX(i.id)', 'max').getRawOne<{ max: number | null }>();
    return { id: Number(row?.max ?? 0) + 1 };
  }

  /** Full investigation for the reading page: recommendations, lessons, tasks and their parameters. */
  async findOne(id: number) {
    const inv = await this.investigations.findOne({
      where: { id },
      relations: { units: true, recommendations: true, lessons: { tasks: { parameters: true } } },
      order: { units: { name: 'ASC' }, recommendations: { position: 'ASC' }, lessons: { id: 'ASC', tasks: { id: 'ASC' } } },
    });
    if (!inv) throw new NotFoundException(`Investigation ${id} not found`);
    return inv;
  }

  async create(dto: CreateInvestigationDto) {
    if (await this.investigations.existsBy({ id: dto.id })) {
      throw new ConflictException(`Investigation number ${dto.id} already exists`);
    }
    const { recommendations = [], lessons = [], unitIds = [], ...fields } = dto;
    const inv = this.investigations.create({
      ...fields,
      ...(await this.resolveFiles(dto)),
      units: await this.units.byIds(unitIds),
      recommendations: recommendations
        .map((t) => t.trim())
        .filter(Boolean)
        .map((text, position) => ({ text, position }) as Recommendation),
      lessons: lessons
        .map((n) => n.trim())
        .filter(Boolean)
        .map((name) => ({ name, status: LessonStatus.NEW }) as Lesson),
    });
    await this.investigations.save(inv);
    return this.findOne(inv.id);
  }

  async update(id: number, dto: UpdateInvestigationDto) {
    const inv = await this.investigations.findOne({ where: { id }, relations: { units: true } });
    if (!inv) throw new NotFoundException(`Investigation ${id} not found`);
    const { unitIds, ...fields } = dto;
    Object.assign(inv, fields, await this.resolveFiles(dto));
    // unitIds replaces the whole set of units; leave it out to keep them as they are
    if (unitIds) inv.units = await this.units.byIds(unitIds);
    await this.investigations.save(inv);
    return this.findOne(id);
  }

  /** Deletes the investigation and everything linked to it, in one transaction. */
  async remove(id: number) {
    await this.investigations.manager.transaction(async (m) => {
      if (!(await m.existsBy(Investigation, { id }))) throw new NotFoundException(`Investigation ${id} not found`);
      const lessonIds = (await m.find(Lesson, { select: { id: true }, where: { investigationId: id } })).map((l) => l.id);
      await deleteLessonsCascade(m, lessonIds);
      await m.delete(Recommendation, { investigationId: id });
      // unlink its units (the units themselves stay)
      await m.createQueryBuilder().delete().from(UNIT_JOIN_TABLE).where({ investigationId: id }).execute();
      await m.delete(Investigation, { id });
    });
  }

  // ---- recommendations ----

  async addRecommendation(investigationId: number, dto: RecommendationDto) {
    if (!(await this.investigations.existsBy({ id: investigationId }))) {
      throw new NotFoundException(`Investigation ${investigationId} not found`);
    }
    const position = dto.position ?? (await this.recommendations.countBy({ investigationId }));
    return this.recommendations.save(this.recommendations.create({ investigationId, text: dto.text.trim(), position }));
  }

  async updateRecommendation(id: number, dto: UpdateRecommendationDto) {
    const rec = await this.recommendations.findOneBy({ id });
    if (!rec) throw new NotFoundException(`Recommendation ${id} not found`);
    Object.assign(rec, dto);
    return this.recommendations.save(rec);
  }

  /**
   * "ליישום" on a recommendation: it becomes a lesson of the same investigation, already sent to
   * lessons management – exactly like clicking "ליישום" on a lesson. The recommendation keeps a link to it,
   * so a second click just returns the same lesson. Returns the recommendation with its lessonId.
   */
  async sendRecommendationToImplementation(id: number) {
    return this.recommendations.manager.transaction(async (m) => {
      const rec = await m.findOneBy(Recommendation, { id });
      if (!rec) throw new NotFoundException(`Recommendation ${id} not found`);
      if (rec.lessonId != null && (await m.existsBy(Lesson, { id: rec.lessonId }))) {
        await m.update(Lesson, { id: rec.lessonId }, { inImplementation: true });
        return rec;
      }
      const text = rec.text.trim();
      const long = text.length > LESSON_NAME_MAX;
      const lesson = await m.save(
        m.create(Lesson, {
          investigationId: rec.investigationId,
          name: long ? `${text.slice(0, LESSON_NAME_MAX - 1)}…` : text,
          notes: long ? text : '',
          status: LessonStatus.NEW,
          inImplementation: true,
        }),
      );
      rec.lessonId = lesson.id;
      return m.save(rec);
    });
  }

  async removeRecommendation(id: number) {
    const res = await this.recommendations.delete({ id });
    if (!res.affected) throw new NotFoundException(`Recommendation ${id} not found`);
  }

  /**
   * "Text or file" fields: a field holds text OR a file, never both.
   * Sending a fileId clears the text; sending text clears the file.
   */
  private async resolveFiles(dto: Partial<CreateInvestigationDto>) {
    const out: Partial<Investigation> = {};
    for (const key of TEXT_OR_FILE) {
      const text = dto[`${key}Text` as const];
      const fileId = dto[`${key}FileId` as const];
      if (text != null && fileId != null) {
        throw new BadRequestException(`${key}: send either ${key}Text or ${key}FileId, not both`);
      }
      if (fileId != null) {
        const file = await this.attachments.findOneBy({ id: fileId });
        if (!file) throw new BadRequestException(`${key}FileId: attachment ${fileId} not found`);
        out[`${key}File`] = file;
        out[`${key}Text`] = null;
      } else if (text != null) {
        out[`${key}Text`] = text;
        out[`${key}File`] = null;
      }
    }
    // never let the raw *FileId keys reach the entity
    for (const key of TEXT_OR_FILE) delete (dto as Record<string, unknown>)[`${key}FileId`];
    return out;
  }
}
