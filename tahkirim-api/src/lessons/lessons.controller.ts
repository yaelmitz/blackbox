import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateLessonDto,
  CreateTaskDto,
  LessonQueryDto,
  ParameterDto,
  UpdateLessonDto,
  UpdateParameterDto,
  UpdateTaskDto,
} from './dto/lesson.dto';
import { LessonsService } from './lessons.service';

@ApiTags('lessons – לקחים')
@Controller()
export class LessonsController {
  constructor(private readonly service: LessonsService) {}

  /** Lessons management page (filter by status or investigation) */
  @Get('lessons')
  findAll(@Query() query: LessonQueryDto) {
    return this.service.findAll(query);
  }

  @Get('lessons/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  /** Add a lesson to an investigation */
  @Post('investigations/:investigationId/lessons')
  create(@Param('investigationId', ParseIntPipe) investigationId: number, @Body() dto: CreateLessonDto) {
    return this.service.create(investigationId, dto);
  }

  /** "ליישום": send the lesson to lessons management */
  @Post('lessons/:id/implement')
  @HttpCode(200)
  sendToImplementation(@Param('id', ParseIntPipe) id: number) {
    return this.service.sendToImplementation(id);
  }

  @Patch('lessons/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLessonDto) {
    return this.service.update(id, dto);
  }

  @Delete('lessons/:id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

@ApiTags('tasks – משימות')
@Controller()
export class TasksController {
  constructor(private readonly service: LessonsService) {}

  /** Add a task (optionally with parameters) to a lesson */
  @Post('lessons/:lessonId/tasks')
  create(@Param('lessonId', ParseIntPipe) lessonId: number, @Body() dto: CreateTaskDto) {
    return this.service.addTask(lessonId, dto);
  }

  @Get('tasks/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findTask(id);
  }

  @Patch('tasks/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.service.updateTask(id, dto);
  }

  @Delete('tasks/:id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeTask(id);
  }
}

@ApiTags('parameters – פרמטרים')
@Controller()
export class ParametersController {
  constructor(private readonly service: LessonsService) {}

  @Post('tasks/:taskId/parameters')
  create(@Param('taskId', ParseIntPipe) taskId: number, @Body() dto: ParameterDto) {
    return this.service.addParameter(taskId, dto);
  }

  @Patch('parameters/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateParameterDto) {
    return this.service.updateParameter(id, dto);
  }

  @Delete('parameters/:id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeParameter(id);
  }
}
