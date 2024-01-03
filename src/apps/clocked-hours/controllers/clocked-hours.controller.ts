import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClockedHoursService } from '../services/clocked-hours.service';
import { CreateClockedHourDto } from '../dto/create-clocked-hour.dto';
import { UpdateClockedHourDto } from '../dto/update-clocked-hour.dto';

@Controller('clocked-hours')
export class ClockedHoursController {
  constructor(private readonly clockedHoursService: ClockedHoursService) {}

  @Post()
  create(@Body() createClockedHourDto: CreateClockedHourDto) {
    return this.clockedHoursService.create(createClockedHourDto);
  }

  @Get()
  findAll() {
    return this.clockedHoursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clockedHoursService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClockedHourDto: UpdateClockedHourDto,
  ) {
    return this.clockedHoursService.update(+id, updateClockedHourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clockedHoursService.remove(+id);
  }
}
