export type IUser = {
  id?: string;
  email: string;
  password?: string;
  names?: Record<string, any>[];
  photos?: Record<string, any>[];
  emailAddresses?: any[];
  googleVerified?: boolean;
  isSuperAdmin?: boolean;
  isActive?: boolean;
  linkedinVerified?: boolean;
  githubVerified?: boolean;
  location?: string;
  bio?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  role: IProfession;
  avatar?: string;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
  address?: string;
};
export type IProfession =
  | 'Ceo'
  | 'Marketing'
  | 'Recruitment'
  | 'Developer'
  | 'CTO';
