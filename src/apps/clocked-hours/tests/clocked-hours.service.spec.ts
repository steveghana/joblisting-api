import { Test, TestingModule } from '@nestjs/testing';
import { ClockedHoursService } from '../services/clocked-hours.service';

describe('ClockedHoursService', () => {
  let service: ClockedHoursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClockedHoursService],
    }).compile();

    service = module.get<ClockedHoursService>(ClockedHoursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
