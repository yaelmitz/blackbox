import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { pageArgs, paged } from '../common/pagination';
import { deleteLessonsCascade, deleteTasksCascade } from '../common/cascade';
import { TaskStatus } from '../common/enums';
import { Investigation } from '../entities/investigation.entity';
import { Lesson } from '../entities/lesson.entity';
import { TaskParameter } from '../entities/task-parameter.entity';
import { Task } from '../entities/task.entity';
import {
  CreateLessonDto,
  CreateTaskDto,
  LessonQueryDto,
  ParameterDto,
  UpdateLessonDto,
  UpdateParameterDto,
  UpdateTaskDto,
} from './dto/lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private readonly lessons: Repository<Lesson>,
    @InjectRepository(Task) private readonly tasks: Repository<Task>,
    @InjectRepository(TaskParameter) private readonly params: Repository<TaskParameter>,
    @InjectRepository(Investigation) private readonly investigations: Repository<Investigation>,
  ) {}

  // ---- lessons ----

  /**
   * Lessons, one page at a time: each lesson with its source investigation and tasks.
   * Lessons management asks for inImplementation=true (only lessons sent with "ליישום").
   * `counts` gives the number of lessons per status within the same scope (ignoring the status filter), for the filter chips.
   */
  async findAll(query: LessonQueryDto) {
    const { page, pageSize, skip, take } = pageArgs(query);
    const scope = { investigationId: query.investigationId, inImplementation: query.inImplementation };
    const [ids, total] = await this.lessons.findAndCount({
      select: { id: true },
      where: { ...scope, status: query.status },
      order: { id: 'ASC' },
      skip,
      take,
    });
    const items = ids.length
      ? await this.lessons.find({
          where: { id: In(ids.map((l) => l.id)) },
          relations: { investigation: { units: true }, tasks: { parameters: true } },
          order: { id: 'ASC', tasks: { id: 'ASC', parameters: { id: 'ASC' } } },
        })
      : [];
    const countQb = this.lessons.createQueryBuilder('l').select('l.status', 'status').addSelect('COUNT(*)', 'count');
    if (query.investigationId) countQb.andWhere('l.investigationId = :inv', { inv: query.investigationId });
    if (query.inImplementation !== undefined) countQb.andWhere('l.inImplementation = :impl', { impl: query.inImplementation });
    const rows = await countQb.groupBy('l.status').getRawMany<{ status: string; count: string | number }>();
    const counts = Object.fromEntries(rows.map((r) => [r.status, Number(r.count)]));
    return { ...paged(items, total, page, pageSize), counts };
  }

  async findOne(id: number) {
    const lesson = await this.lessons.findOne({
      where: { id },
      relations: { investigation: { units: true }, tasks: { parameters: true } },
      order: { tasks: { id: 'ASC', parameters: { id: 'ASC' } } },
    });
    if (!lesson) throw new NotFoundException(`Lesson ${id} not found`);
    return lesson;
  }

  async create(investigationId: number, dto: CreateLessonDto) {
    if (!(await this.investigations.existsBy({ id: investigationId }))) {
      throw new NotFoundException(`Investigation ${investigationId} not found`);
    }
    const saved = await this.lessons.save(this.lessons.create({ ...dto, name: dto.name.trim(), investigationId }));
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateLessonDto) {
    const lesson = await this.lessons.findOneBy({ id });
    if (!lesson) throw new NotFoundException(`Lesson ${id} not found`);
    Object.assign(lesson, dto);
    await this.lessons.save(lesson);
    return this.findOne(id);
  }

  /** "ליישום": moves the lesson into lessons management. Idempotent. */
  async sendToImplementation(id: number) {
    const lesson = await this.lessons.findOneBy({ id });
    if (!lesson) throw new NotFoundException(`Lesson ${id} not found`);
    if (!lesson.inImplementation) {
      lesson.inImplementation = true;
      await this.lessons.save(lesson);
    }
    return this.findOne(id);
  }

  /** Deletes the lesson with its tasks and their parameters. */
  async remove(id: number) {
    await this.lessons.manager.transaction(async (m) => {
      if (!(await m.existsBy(Lesson, { id }))) throw new NotFoundException(`Lesson ${id} not found`);
      await deleteLessonsCascade(m, [id]);
    });
  }

  // ---- tasks ----

  async addTask(lessonId: number, dto: CreateTaskDto) {
    if (!(await this.lessons.existsBy({ id: lessonId }))) throw new NotFoundException(`Lesson ${lessonId} not found`);
    const task = this.tasks.create({
      lessonId,
      name: dto.name.trim(),
      status: dto.status ?? TaskStatus.OPEN,
      parameters: (dto.parameters ?? []).map((p) => this.params.create({ name: p.name.trim(), value: p.value ?? '' })),
    });
    const saved = await this.tasks.save(task);
    return this.findTask(saved.id);
  }

  async findTask(id: number) {
    const task = await this.tasks.findOne({ where: { id }, relations: { parameters: true } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async updateTask(id: number, dto: UpdateTaskDto) {
    const task = await this.tasks.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    Object.assign(task, dto);
    await this.tasks.save(task);
    return this.findTask(id);
  }

  /** Deletes the task with its parameters. */
  async removeTask(id: number) {
    await this.tasks.manager.transaction(async (m) => {
      if (!(await m.existsBy(Task, { id }))) throw new NotFoundException(`Task ${id} not found`);
      await deleteTasksCascade(m, [id]);
    });
  }

  // ---- parameters ----

  async addParameter(taskId: number, dto: ParameterDto) {
    if (!(await this.tasks.existsBy({ id: taskId }))) throw new NotFoundException(`Task ${taskId} not found`);
    return this.params.save(this.params.create({ taskId, name: dto.name.trim(), value: dto.value ?? '' }));
  }

  async updateParameter(id: number, dto: UpdateParameterDto) {
    const p = await this.params.findOneBy({ id });
    if (!p) throw new NotFoundException(`Parameter ${id} not found`);
    Object.assign(p, dto);
    return this.params.save(p);
  }

  async removeParameter(id: number) {
    const res = await this.params.delete({ id });
    if (!res.affected) throw new NotFoundException(`Parameter ${id} not found`);
  }
}
