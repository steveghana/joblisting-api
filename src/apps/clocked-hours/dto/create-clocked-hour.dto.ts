import { Ihours } from '../../../types/hours';
export class CreateClockedHourDto implements Ihours {
  date: Date;
  developer: Record<any, any>;
  hours_worked: number;
  id: string;
}
