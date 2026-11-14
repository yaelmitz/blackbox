import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateInvestigationDto,
  InvestigationQueryDto,
  RecommendationDto,
  UpdateInvestigationDto,
  UpdateRecommendationDto,
} from './dto/investigation.dto';
import { InvestigationsService } from './investigations.service';

@ApiTags('investigations – תחקירים')
@Controller('investigations')
export class InvestigationsController {
  constructor(private readonly service: InvestigationsService) {}

  /** Investigations table, one page at a time */
  @Get()
  findAll(@Query() query: InvestigationQueryDto) {
    return this.service.findAll(query);
  }

  /** Values for the table filters */
  @Get('filters')
  filterOptions() {
    return this.service.filterOptions();
  }

  /** Suggested number for a new investigation */
  @Get('next-id')
  nextId() {
    return this.service.nextId();
  }

  /** Reading page: everything, including lessons, tasks and parameters */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateInvestigationDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInvestigationDto) {
    return this.service.update(id, dto);
  }

  /** Deletes the investigation with its recommendations, lessons, tasks and parameters */
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/recommendations')
  addRecommendation(@Param('id', ParseIntPipe) id: number, @Body() dto: RecommendationDto) {
    return this.service.addRecommendation(id, dto);
  }
}

@ApiTags('recommendations – המלצות')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly service: InvestigationsService) {}

  /** "ליישום": the recommendation becomes a lesson in lessons management */
  @Post(':id/implement')
  @HttpCode(200)
  sendToImplementation(@Param('id', ParseIntPipe) id: number) {
    return this.service.sendRecommendationToImplementation(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRecommendationDto) {
    return this.service.updateRecommendation(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeRecommendation(id);
  }
}
