import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { LessonStatus, TaskStatus } from '../../common/enums';
import { PageQueryDto } from '../../common/pagination';

// ---- lessons ----

export class CreateLessonDto {
  /** שם */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  /** הערות */
  @IsOptional()
  @IsString()
  notes?: string;

  /** סטטוס (default NEW) */
  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;

  /** משאבים */
  @IsOptional()
  @IsString()
  resources?: string;
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}

export class LessonQueryDto extends PageQueryDto {
  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  investigationId?: number;

  /** true = only lessons sent to implementation (the lessons management page) */
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  inImplementation?: boolean;
}

// ---- parameters ----

export class ParameterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  value?: string;
}

export class UpdateParameterDto extends PartialType(ParameterDto) {}

// ---- tasks ----

export class CreateTaskDto {
  /** שם */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  /** סטטוס (default OPEN) */
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  /** פרמטרים to create with the task */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ParameterDto)
  parameters?: ParameterDto[];
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
