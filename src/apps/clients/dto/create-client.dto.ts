import { IClient } from '@/types/client';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsArray,
  IsDateString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ProjectDetailsDto,
  RoleInfoDto,
} from '../../../apps/roles/dto/create-role.dto';
// Enum for employment type

// Enum for communication preferences

export class ClientDto {
  @IsOptional()
  @IsString()
  id?: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsArray()
  industry: string[];
  @IsNotEmpty()
  @IsString()
  numOfEmployees: string;
  @IsNotEmpty()
  @IsString()
  companyName: string;
  @IsOptional()
  @IsString()
  companyLogo: string;
  @IsNotEmpty()
  @IsString()
  aboutTheCompany: string;
  avatar?: string;
  // Assuming description is a string
  @IsNotEmpty()
  // @IsString()
  country: Record<string, any>;
  // Assuming phoneNumber is a string
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
  // Assuming projectTitle is a string
  @IsNotEmpty()
  @IsString()
  projectTitle: string;

  // Assuming startDate is a date string
  @IsOptional()
  @IsDateString()
  startDate: Date;

  constructor(data: IClient) {
    Object.assign(this, data);
  }
}

export class ClientFormDataDto {
  @Type(() => ClientDto)
  @ValidateNested()
  @IsNotEmpty()
  'Client Info': ClientDto;

  @Type(() => ProjectDetailsDto)
  @ValidateNested()
  @IsNotEmpty()
  'Project Details': ProjectDetailsDto;

  @Type(() => RoleInfoDto)
  @ValidateNested()
  @IsNotEmpty()
  'Role Info': RoleInfoDto;
}
