import { IDev } from './developer';
import { IRole } from './role';

export interface Iinterviews {
  id?: string;

  role: IRole;

  guest?: IDev[];
  eventType: string;
  eventOption: string;
  description: string;
  eventLInk: string;
  starttime: string;
  endtime: string;
  startDate: Date;
  endDate: Date;
  candidate?: IDev;
  comments?: TInterviewComment[];

  createdAt?: Date;
  updatedAt?: Date;

  status: 'Scheduled' | 'Completed' | 'Canceled'; //
}
export type TInterviewComment = {
  name: string;
  message: string;
  // interviewerId: string;
  interviewId?: string;
};
