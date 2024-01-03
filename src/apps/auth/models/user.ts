import { IProfession } from './user.entity';

export type IUser = {
  id?: string;
  email: string;
  password?: string;
  role: IProfession /* 'Ceo' | 'Developer' | 'Marketing' | 'HR'; */;
  firstName: string;
  lastName: string;
  // address?: string;
};
