import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
// type IinterviewAs = 'interviewee' | 'guest';
// type INewUser = Pick<IDev, 'address' | ''>
export class CreateDeveloperDto {
  @IsNotEmpty({
    message: 'please enter your first name',
  })
  @IsString()
  firstName: string;
  @IsNotEmpty({
    message: 'please add your last name',
  })
  @IsString()
  lastName: string;
  @IsNotEmpty({
    message: 'please enter your address',
  })
  @IsString()
  address: string;
  @IsOptional({
    message: 'Salary is required',
  })
  @IsNumber()
  salary: number;
  @IsOptional({
    message: 'roleid is required',
  })
  @IsString()
  roleId: string;
  @IsOptional({
    message: 'profession is required',
  })
  @IsString()
  devProfession: string;
  @IsNotEmpty({
    message: 'role is required',
  })
  @IsString()
  @IsNotEmpty({
    message: 'please enter your phone number',
  })
  phone_number: string;

  @IsNotEmpty({
    message: 'skills is required',
  })
  @IsNotEmpty()
  @IsArray()
  skills: string[];
  @IsString()
  email: string;
  @IsString()
  years_of_experience: string;
  role_status: 'InHouse' | 'Pending' | 'External' | 'Accepted';
  //   user: IUser;
}
export class AssignDevDto {
  @IsNotEmpty({
    message: 'Client id is required',
  })
  @IsString()
  clientId: string;
  @IsNotEmpty({
    message: 'Role id is required',
  })
  @IsString()
  roleId: string;
  @IsOptional()
  @IsString()
  jobId: string;
}
