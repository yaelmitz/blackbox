import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UnitDto {
  /** שם המסגרת */
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;
}
