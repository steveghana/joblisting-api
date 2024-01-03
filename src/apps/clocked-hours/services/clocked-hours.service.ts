import { Injectable } from '@nestjs/common';
import { CreateClockedHourDto } from '../dto/create-clocked-hour.dto';
import { UpdateClockedHourDto } from '../dto/update-clocked-hour.dto';
import { useTransaction } from '../../../util/transaction';

@Injectable()
export class ClockedHoursService {
  create(createClockedHourDto: CreateClockedHourDto) {
    return useTransaction(async (transaction) => {});

    return 'This action adds a new clockedHour';
  }

  findAll() {
    return `This action returns all clockedHours`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clockedHour`;
  }

  update(id: number, updateClockedHourDto: UpdateClockedHourDto) {
    return `This action updates a #${id} clockedHour`;
  }

  remove(id: number) {
    return `This action removes a #${id} clockedHour`;
  }
}
