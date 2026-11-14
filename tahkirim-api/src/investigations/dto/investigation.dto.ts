import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Classification, InvestigationType } from '../../common/enums';
import { PageQueryDto } from '../../common/pagination';

export class CreateInvestigationDto {
  /** מספר מזהה (must be unique) */
  @IsInt()
  @Min(1)
  id!: number;

  /** נושא */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subject!: string;

  /** תאריך, YYYY-MM-DD */
  @IsISO8601({ strict: true })
  date!: string;

  /** סוג */
  @IsEnum(InvestigationType)
  type!: InvestigationType;

  /** סיווג */
  @IsEnum(Classification)
  classification!: Classification;

  /** מסגרות – ids from GET /api/units (many-to-many) */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsInt({ each: true })
  unitIds?: number[];

  /** מפרסם */
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  publisher!: string;

  /** רקע */
  @IsOptional()
  @IsString()
  background?: string;

  /** שאלות */
  @IsOptional()
  @IsString()
  questions?: string;

  /** מיקום – text. Send either this or locationFileId. */
  @IsOptional()
  @IsString()
  locationText?: string;

  /** מיקום – id of a file uploaded to POST /api/attachments */
  @IsOptional()
  @IsUUID()
  locationFileId?: string;

  /** נ"צ – text */
  @IsOptional()
  @IsString()
  coordinatesText?: string;

  /** נ"צ – uploaded file id */
  @IsOptional()
  @IsUUID()
  coordinatesFileId?: string;

  /** מה קרה – HTML from the rich text editor */
  @IsOptional()
  @IsString()
  whatHappened?: string;

  /** מה תוכנן – HTML */
  @IsOptional()
  @IsString()
  whatPlanned?: string;

  /** מסקנות – HTML */
  @IsOptional()
  @IsString()
  conclusions?: string;

  /** מקורות מידע – text */
  @IsOptional()
  @IsString()
  sourcesText?: string;

  /** מקורות מידע – uploaded file id */
  @IsOptional()
  @IsUUID()
  sourcesFileId?: string;

  /** בעלי התפקידים */
  @IsOptional()
  @IsString()
  roles?: string;

  /** המלצות – created linked to the investigation */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  recommendations?: string[];

  /** לקחים – names; each is created with status NEW */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  lessons?: string[];
}

export class UpdateInvestigationDto extends PartialType(
  OmitType(CreateInvestigationDto, ['id', 'recommendations', 'lessons'] as const),
) {}

export class InvestigationQueryDto extends PageQueryDto {
  /** Free-text search over number, subject, unit and publisher */
  @IsOptional()
  @IsString()
  q?: string;

  /** מסגרת – investigations linked to this unit id */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  unitId?: number;

  @IsOptional()
  @IsEnum(InvestigationType)
  type?: InvestigationType;

  @IsOptional()
  @IsEnum(Classification)
  classification?: Classification;

  @IsOptional()
  @IsIn(['date', 'id', 'subject'])
  sort?: 'date' | 'id' | 'subject';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}

export class RecommendationDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  position?: number;
}

export class UpdateRecommendationDto extends PartialType(RecommendationDto) {}
