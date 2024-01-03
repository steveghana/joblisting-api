import { PartialType } from '@nestjs/swagger';
import { CreateClockedHourDto } from './create-clocked-hour.dto';

export class UpdateClockedHourDto extends PartialType(CreateClockedHourDto) {}
