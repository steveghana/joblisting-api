import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import { createHours, getHoursByDeveloper } from '../DBQueries/index';
import { EntityManager } from 'typeorm';
import { IClient } from '@/types/client';
import { Ihours } from '@/types/hours';

class Hours {
  dependencies: Dependencies = null;
  data: Ihours = null;

  constructor(dependencies: Dependencies = null) {
    this.dependencies = injectDependencies(dependencies, ['db', 'config']);
  }

  static async createHours(
    developerId: string,
    application: Ihours,
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ): Promise<Hours> {
    dependencies = injectDependencies(dependencies, ['db']);
    const newApplication = new Hours(dependencies);
    newApplication.data = await createHours(
      developerId,
      application,
      transaction,
      dependencies,
    );
    return newApplication;
  }

  static async getByDeveloperId(
    id: string,
    dependencies: Dependencies = null,
  ): Promise<Hours> {
    dependencies = injectDependencies(dependencies, ['db']);
    const newApplication = new Hours(dependencies);

    newApplication.data = await getHoursByDeveloper(id, null, dependencies);
    return newApplication;
  }

  get id(): string {
    return this.data.id;
  }

  get email(): Date {
    return this.data.date;
  }
  get industry(): number {
    return this.data.hours_worked;
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

export default Hours;
