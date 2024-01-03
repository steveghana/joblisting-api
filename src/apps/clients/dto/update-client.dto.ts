import { IClient, IClientFormData } from '@/types/client';
import { IsOptional, IsArray, IsEnum } from 'class-validator';

// Enum for employment type
enum EmploymentType {
  FullTime = 'Full Time',
  PartTime = 'Part Time',
  Contract = 'Contract',
}

// Enum for communication preferences
enum CommunicationPreferences {
  Email = 'Email',
  Phone = 'Phone',
  Both = 'Both',
}

export class UpdateClientDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  @IsArray()
  industry?: string[];

  @IsOptional()
  numOfEmployees?: string;

  @IsOptional()
  companyName?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  projectTitle?: string;

  @IsOptional()
  startDate?: Date;

  constructor(data: Partial<IClient>) {
    Object.assign(this, data);
  }
}

export class UpdateProjectDetailsDto {
  @IsOptional()
  @IsArray()
  selectedSkills?: string[];

  @IsOptional()
  DevsNeeded?: string;

  @IsOptional()
  methodology?: string;

  @IsOptional()
  experience?: string;

  @IsOptional()
  testingQA?: string;

  constructor(data: Partial<IClientFormData['Project Details']>) {
    Object.assign(this, data);
  }
}

export class UpdateAdditionalDataDto {
  @IsOptional()
  durationForEmployment?: string;

  @IsOptional()
  whenToStart?: string;

  @IsOptional()
  dataContent?: string;

  constructor(data: Partial<IClientFormData['Additional Data']>) {
    Object.assign(this, data);
  }
}

export class UpdateCommunicationTypeDto {
  @IsOptional()
  @IsEnum(CommunicationPreferences)
  communicationPreferences?: string;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: string;

  constructor(data: Partial<IClientFormData['Communication Type']>) {
    Object.assign(this, data);
  }
}

export class UpdateClientFormDataDto {
  @IsOptional()
  clientInfo?: UpdateClientDto;

  @IsOptional()
  projectDetails?: UpdateProjectDetailsDto;

  @IsOptional()
  additionalData?: UpdateAdditionalDataDto;

  @IsOptional()
  communicationType?: UpdateCommunicationTypeDto;

  constructor(data: Partial<IClientFormData>) {
    Object.assign(this, data);
  }
}
