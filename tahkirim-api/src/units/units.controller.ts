import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UnitDto } from './dto/unit.dto';
import { UnitsService } from './units.service';

@ApiTags('units – מסגרות')
@Controller('units')
export class UnitsController {
  constructor(private readonly service: UnitsService) {}

  /** All units (alphabetical) with how many investigations use each */
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: UnitDto) {
    return this.service.create(dto);
  }

  /** Rename */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UnitDto) {
    return this.service.update(id, dto);
  }

  /** Delete the unit; investigations that used it stay, without it */
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
