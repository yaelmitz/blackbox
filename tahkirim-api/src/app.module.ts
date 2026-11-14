import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentsModule } from './attachments/attachments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { dbOptions } from './db.config';
import { InvestigationsModule } from './investigations/investigations.module';
import { LessonsModule } from './lessons/lessons.module';
import { SeedService } from './seed/seed.service';
import { UnitsModule } from './units/units.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: dbOptions }),
    UnitsModule,
    InvestigationsModule,
    LessonsModule,
    AttachmentsModule,
    DashboardModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
