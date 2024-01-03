import { IDev } from '@/types/developer';
import { Iinterviews } from '@/types/interviews';
import { IRole } from '@/types/role';
import { IsNotEmpty } from 'class-validator';
type IinterviewAs = 'interviewee' | 'guest';

export class CreateInterviewDto {
  @IsNotEmpty({
    message: 'please enter interview status',
  })
  status: 'Scheduled' | 'Completed' | 'Canceled';
  @IsNotEmpty({
    message: 'interviewee Id is required',
  })
  candidateId: string;
  @IsNotEmpty({
    message: 'guest Ids is required',
  })
  guests: string[];

  @IsNotEmpty({
    message: 'event type is required',
  })
  eventType: string;
  @IsNotEmpty({
    message: 'event option is required',
  })
  eventOption: string;
  @IsNotEmpty({
    message: 'description is required',
  })
  description: string;
  @IsNotEmpty({
    message: 'even link  is required',
  })
  eventLInk: string;
  @IsNotEmpty({
    message: 'start time is required',
  })
  starttime: string;
  @IsNotEmpty({
    message: 'end time is required',
  })
  endtime: string;
  @IsNotEmpty({
    message: 'start date is required',
  })
  startDate: Date;
  @IsNotEmpty({
    message: 'end date is required',
  })
  endDate: Date;
  // role: IRole;
}

export class addCommentDto {
  @IsNotEmpty({
    message: 'Comment message is required',
  })
  message: string;
  @IsNotEmpty({
    message: 'your name is required',
  })
  name: string;

  @IsNotEmpty({
    message: 'interview is required',
  })
  interviewId: string;
}
