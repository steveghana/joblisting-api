import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { IRole } from '@/types/role';
import { Type } from 'class-transformer';

export class ProjectDetailsDto {
  // Assuming DevsNeeded is a string
  @IsNotEmpty()
  @IsString()
  devsNeeded: string;
  @IsNotEmpty()
  @IsString()
  aboutTheProject: string;
  @IsOptional()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  methodology: string;
  @IsNotEmpty()
  @IsString()
  experience: string;

  @IsOptional()
  @IsString()
  roleName: string;
  @IsNotEmpty()
  @IsString()
  communicationPreferences: string;

  constructor(data: ProjectDetailsDto) {
    Object.assign(this, data);
  }
}

export class RoleInfoDto {
  // Assuming durationForEmployment is a string
  @IsNotEmpty()
  @IsString()
  durationForEmployment: string;
  @IsNotEmpty()
  @IsString()
  roleName: string;
  @IsNotEmpty()
  // @IsArray()
  selectedSkills: string[];
  // Assuming whenToStart is a string
  @IsNotEmpty()
  // @IsDate()
  whenToStart: Date;
  @IsOptional()
  @IsString()
  salary: string;
  @IsNotEmpty()
  @IsString()
  employmentType: string;
  @IsNotEmpty()
  @IsString()
  roleType: string;
  @IsNotEmpty()
  @IsString()
  jobType: string;
  @IsOptional()
  @IsString()
  roleCategory: string;
  @IsOptional()
  @IsString()
  postedDate: Date;
  @IsNotEmpty()
  tasks: string[];
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  country: string;
  constructor(data: JobInfo) {
    Object.assign(this, data);
  }
}

export interface JobInfo {
  description: string;
  id?: string;
  role?: IRole;
  roleType: string;
  joblink?: string;
  whenToStart: Date;
  employmentType: string;
  selectedSkills: string[];
  country: string;
  jobType: string;
  salary: string;
  roleCategory: string;
  // vacancy_status: 'Open' | 'Closed'; // Open, Closed

  postedDate: Date;
  roleName: string;
  tasks: string[]; // Array of tasks
}

export class CreateRoleDto {
  @IsOptional()
  @IsString()
  clientId: string;
  @IsOptional()
  @IsString()
  id?: string;
  @Type(() => ProjectDetailsDto)
  @ValidateNested()
  @IsNotEmpty()
  'Project Details': ProjectDetailsDto;

  @Type(() => RoleInfoDto)
  @ValidateNested()
  @IsNotEmpty()
  'Role Info': RoleInfoDto;
  // vacancy_status: 'Open' | 'Closed';
}
