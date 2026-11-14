import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { InvestigationType } from '../../common/enums';

/**
 * Dashboard filters. All optional; together they pick the investigations the dashboard counts,
 * and every figure (lessons, tasks, statuses, monthly series) follows from those investigations.
 */
export class DashboardQueryDto {
  /** יחידה – a unit id from GET /api/units (the investigation's מסגרות) */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  unitId?: number;

  /** investigations dated on or after (YYYY-MM-DD) */
  @IsOptional()
  @IsDateString({ strict: true })
  from?: string;

  /** investigations dated on or before (YYYY-MM-DD) */
  @IsOptional()
  @IsDateString({ strict: true })
  to?: string;

  /** סוג – one of the fixed investigation types */
  @IsOptional()
  @IsEnum(InvestigationType)
  type?: InvestigationType;
}
