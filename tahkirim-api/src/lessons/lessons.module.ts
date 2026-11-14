import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investigation } from '../entities/investigation.entity';
import { Lesson } from '../entities/lesson.entity';
import { TaskParameter } from '../entities/task-parameter.entity';
import { Task } from '../entities/task.entity';
import { LessonsController, ParametersController, TasksController } from './lessons.controller';
import { ImplementationMigrationService } from './implementation-migration.service';
import { LessonsService } from './lessons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Task, TaskParameter, Investigation])],
  controllers: [LessonsController, TasksController, ParametersController],
  providers: [LessonsService, ImplementationMigrationService],
})
export class LessonsModule {}
