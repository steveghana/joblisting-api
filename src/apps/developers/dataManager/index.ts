import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import {
  enrollDev,
  getDevById,
  deleteDev,
  assignToRole,
  updateDev,
  bulkdeleteDevs,
  unassignToRole,
} from '../DBQueries/index';
import { EntityManager } from 'typeorm';
import { IDev } from '@/types/developer';

class Developers {
  dependencies: Dependencies = null;
  data: IDev = null;

  constructor(dependencies: Dependencies = null) {
    this.dependencies = injectDependencies(dependencies, ['db', 'config']);
  }

  static async enrollDev(
    devData: IDev,
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ): Promise<IDev> {
    dependencies = injectDependencies(dependencies, ['db']);
    let devsWithoutAdditonalApplicantsInfo;
    if (devData.roles) {
      const {
        roles: { client, application, ...rest },
        ...otheritems
      } = devData;
      devsWithoutAdditonalApplicantsInfo = {
        roles: { ...client, ...rest },
        ...otheritems,
      };
    } else {
      devsWithoutAdditonalApplicantsInfo = devData;
    }
    const newApplication = new Developers(dependencies);
    newApplication.data = await enrollDev(
      devsWithoutAdditonalApplicantsInfo,
      transaction,
      dependencies,
    );
    return newApplication.data;
  }
  static async update(
    devId: string,
    devInfo: Partial<IDev>,
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db']);
    return await updateDev(devId, devInfo, transaction, dependencies);
  }
  static async getById(
    id: string,
    dependencies: Dependencies = null,
  ): Promise<IDev> {
    dependencies = injectDependencies(dependencies, ['db']);
    const newApplication = new Developers(dependencies);
    newApplication.data = await getDevById(id, null, dependencies);
    return newApplication.data;
  }
  static async destroy(
    devId: string,
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ): Promise<number> {
    dependencies = injectDependencies(dependencies, ['db']);
    return await deleteDev(devId, transaction, dependencies);
  }
  static async unassignToRole(
    devId: string,
    roleid: string,
    clientId: string,
    jobId: string,
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db']);
    return await unassignToRole(
      devId,
      roleid,
      clientId,
      jobId,
      transaction,
      dependencies,
    );
  }
  static async assignToRole(
    id: string,
    roleid: string,
    clientId: string,
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db']);
    return await assignToRole(id, roleid, clientId, transaction, dependencies);
  }
  static async bulkdestroy(
    devId: string[],
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ): Promise<number> {
    dependencies = injectDependencies(dependencies, ['db']);
    return await bulkdeleteDevs(devId, transaction, dependencies);
  }
  get id(): string {
    return this.data.id;
  }

  get email(): string {
    return this.data.user.email;
  }
  get phone(): string {
    return this.data.phone_number;
  }
  get firstName(): string {
    return this.data.firstName;
  }
  get lastName(): string {
    return this.data.lastName;
  }
  get roleStatus(): string {
    return this.data.role_status;
  }
  get candidate(): any {
    return this.data.candidate;
  }
  get guest(): any {
    return this.data.guest;
  }
  get role(): Record<any, any> {
    return this.data.roles;
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

export default Developers;
