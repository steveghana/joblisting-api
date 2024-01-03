import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import uuidUtil from '../../../util/uuid';
import { DeepPartial, EntityManager, In } from 'typeorm';
import { Application } from '../entities/application.entity';
import myDataSource from '../../../../db/data-source';
import uuid from '../../../util/uuid';
import { IApplication } from '../../../types/application';
import { IRole } from '../../../types/role';
import { ensureTransaction } from '../../../Config/transaction';

export async function createApplication(
  role: IRole,
  applicationData: IApplication,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  const applicationRepo = transaction.getRepository(
    dependencies.db.models.application,
  );
  const newApplication = await applicationRepo.create({
    job: applicationData.job,
    role,
    ...applicationData,
  });
  const data = await applicationRepo.save(newApplication);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return data;
}
export async function deleteApplicant(
  id: string,
  transaction: EntityManager,
  dependencies: Dependencies = null,
): Promise<number> {
  dependencies = injectDependencies(dependencies, ['db']);
  const applicantRepo = transaction.getRepository(
    dependencies.db.models.application,
  );
  const { affected } = await applicantRepo.delete({
    id,
  });
  return affected;
}
export async function bulkdeleteApplicant(
  id: string[],
  transaction: EntityManager,
  dependencies: Dependencies = null,
): Promise<number> {
  dependencies = injectDependencies(dependencies, ['db']);
  const applicantRepo = transaction.getRepository(
    dependencies.db.models.application,
  );
  const deleted = await Promise.all(
    applicantRepo.delete({
      id: In([id]),
    }) as any,
  );
  const { affected } = deleted[0];
  return affected;
}
// export async function bulkdeleteApplicant(
//   id: string[],
//   transaction: EntityManager,
//   dependencies: Dependencies = null,
// ) {
//   dependencies = injectDependencies(dependencies, ['db']);
//   const applicantRepo = transaction.getRepository(
//     dependencies.db.models.application,
//   );
//   const deleted = await Promise.all(
//     id.map(async (item) => {
//       return applicantRepo.delete({
//         id: item,
//       });
//     }),
//   );
//   const { affected } = deleted[0];
//   return affected;
// }
export function getApplicationById(
  id: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return

  return myDataSource.manager
    .getRepository(dependencies.db.models.application)
    .findOne({
      where: { id },
      relations: ['role'],
    });
}
export function getApplicationByEmail(
  jobId: string,

  email: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return

  return myDataSource.manager
    .getRepository(dependencies.db.models.application)
    .findOne({
      where: { email, job: { id: jobId } },
    });
}
export const getAllApplicants = async (
  roleid: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) => {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return

  return await transaction
    .getRepository(dependencies.db.models.application)
    .find({ where: { role: { id: roleid } }, relations: ['role', 'job'] });
};
export async function updateApplication(
  id: string,
  updates: Partial<IApplication>,
  transactionParam: EntityManager = null,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);
  const applicationRepo = transactionParam.getRepository(
    dependencies.db.models.application,
  );
  return await ensureTransaction(
    transactionParam,
    async () => {
      const data = await applicationRepo.update({ id }, { ...updates });
      return data;
    },
    dependencies,
  );
}

export default {
  createApplication,
  getAllApplicants,
  getApplicationById,
};
