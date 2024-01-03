import { IDev } from './developer';
import { IRole } from './role';

export interface IClient {
  id?: string;
  avatar?: string;
  name: string;
  email: string;
  industry: string[];
  numOfEmployees: string;
  companyName: string;
  phoneNumber: string;
  developers?: IDev[];
  roles?: IRole[];
  projectTitle: string;
  startDate: Date;
  companyLogo: string;
  aboutTheCompany: string;
  country: Record<string, any>;
}
export interface IClientFormData {
  ['Client info']: IClient;
  ['Project Details']: {
    selectedSkills: string[];
    DevsNeeded: string;
    methodology: string;
    aboutTheProject: string;
    experience: string;
    testingQA: string;
  };
  ['Additional Data']: {
    durationForEmployment: string;
    whenToStart: string;
    dataContent: string;
  };
  ['Communication Type']: {
    communicationPreferences: string;
    employmentType: string;
  };
}
