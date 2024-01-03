import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import {
  scheduleInterview,
  getAllInterviews,
  updateInterview,
  getInterviewById,
  cancelInterview,
} from '../DBQueries/index';
import { EntityManager } from 'typeorm';
import { Iinterviews } from '@/types/interviews';
import { IDev } from '@/types/developer';

class Interviews {
  dependencies: Dependencies = null;
  data: Iinterviews = null;

  constructor(dependencies: Dependencies = null) {
    this.dependencies = injectDependencies(dependencies, ['db', 'config']);
  }

  static async createInterviews(
    interviewData: Omit<Iinterviews, 'guest' | 'interviewee' | 'role'> & {
      candidateId: string;
      guests: string[];
    },
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db']);
    const newApplication = new Interviews(dependencies);
    newApplication.data = await scheduleInterview(
      interviewData,
      transaction,
      dependencies,
    );
    return newApplication.data;
  }
  static async updateInterviews(
    id: string,
    interviewData: Partial<
      Omit<Iinterviews, 'guest' | 'interviewee' | 'role'> & {
        candidateId: string;
        guests: string[];
      }
    >,
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db']);
    const newApplication = new Interviews(dependencies);
    return await updateInterview(id, interviewData, transaction, dependencies);
  }

  static async getById(id: string, dependencies: Dependencies = null) {
    dependencies = injectDependencies(dependencies, ['db']);
    const newApplication = new Interviews(dependencies);
    newApplication.data = await getInterviewById(id, null, dependencies);
    return newApplication.data;
  }

  static async cancleInterview(
    interviewId: string,
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db']);
    const canceld = await cancelInterview(
      interviewId,
      transaction,
      dependencies,
    );
    return canceld;
  }

  get id(): string {
    return this.data.id;
  }

  get status(): string {
    return this.data.status;
  }
  get candidate(): IDev {
    return this.data.candidate;
  }
  get guests(): IDev[] {
    return this.data.guest;
  }
  get startDate(): Date {
    return this.data.startDate;
  }
  get endDate(): Date {
    return this.data.endDate;
  }
  get startTime(): string {
    return this.data.starttime;
  }
  get endTime(): string {
    return this.data.endtime;
  }

  get role(): Record<any, any> {
    return this.data.role;
  }
  get createdAt(): Date {
    return this.data.createdAt;
  }
  get updatedAt(): Date {
    return this.data.updatedAt;
  }
  get exists(): boolean {
    return this.data !== null;
  }

  //   isInactive(): boolean {
  //     return (
  //       !this.data.isActive ||
  //       Date.now() - new Date(this.data.createdAt).getTime() >
  //         this.dependencies.config.authentication.credentialTokenTTL
  //     );
  //   }
}

export default Interviews;
