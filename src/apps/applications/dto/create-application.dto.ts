import { IStatusApplication } from '@/types/application';
import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty({
    message: 'role is required',
  })
  @IsString()
  roleId: string;
  @IsNotEmpty({
    message: 'jobid is required',
  })
  @IsString()
  jobId: string;
  @IsNotEmpty({
    message: 'roleApplyiingFor is required',
  })
  @IsString()
  roleApplyingFor: string;

  // developer: Partial<IDev>;
  @IsNotEmpty({
    message: 'name is required',
  })
  @IsString()
  name: string;
  @IsNotEmpty({
    message: 'phoneNumber is required',
  })
  @IsString()
  phoneNumber: string;
  @IsNotEmpty({
    message: 'address is required',
  })
  @IsString()
  address: string;
  @IsNotEmpty({
    message: 'skills is required',
  })
  @IsArray()
  selectedSkills: string[];
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'Years of experience is required',
  })
  years_of_experience: string;
  @IsOptional()
  coverLetter: string;

  @IsOptional()
  background_questions?: Record<string, string>;

  @IsNotEmpty({
    message: 'Resume is required',
  })
  file: Express.Multer.File;

  status: IStatusApplication;
}
