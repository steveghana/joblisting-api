import { Module } from '@nestjs/common';
import { ClockedHoursService } from './services/clocked-hours.service';
import { ClockedHoursController } from './controllers/clocked-hours.controller';

@Module({
  controllers: [ClockedHoursController],
  providers: [ClockedHoursService],
})
export class ClockedHoursModule {}
