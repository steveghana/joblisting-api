import { Test, TestingModule } from '@nestjs/testing';
import { ClockedHoursController } from '../controllers/clocked-hours.controller';
import { ClockedHoursService } from '../services/clocked-hours.service';

describe('ClockedHoursController', () => {
  let controller: ClockedHoursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClockedHoursController],
      providers: [ClockedHoursService],
    }).compile();

    controller = module.get<ClockedHoursController>(ClockedHoursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
