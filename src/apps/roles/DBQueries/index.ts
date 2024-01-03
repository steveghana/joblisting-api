import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import { EntityManager } from 'typeorm';
import myDataSource from '../../../../db/data-source';
import { IRole } from '../../../types/role';
import { ensureTransaction } from '../../../Config/transaction';
import { JobInfo } from '../dto/create-role.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { destroyLink } from '../../../apps/Shorturl/DBQueries/shortUrl';

export async function createRoles(
  applicationData: IRole,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  const role = transaction.getRepository(dependencies.db.models.role);
  const { jobs, ...rest } = applicationData;
  const newApplication = await role.create({
    ...rest,
  });

  const data = await role.save(newApplication);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return data;
}
export async function createJobs(
  roleId: string,
  job: JobInfo,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  const role = transaction.getRepository(dependencies.db.models.role);
  const jobRepo = transaction.getRepository(dependencies.db.models.jobs);
  const roleForJob = await role.findOne({ where: { id: roleId } });

  const createJob = await jobRepo.create({
    role: roleForJob,
    ...job,
    postedDate: new Date(),
  });
  await jobRepo.save(createJob);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return { role: roleForJob, job: createJob };
}
export async function updatejobs(
  id: string,
  job: Partial<JobInfo>,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  const jobRepo = transaction.getRepository(dependencies.db.models.jobs);
  const { affected } = await jobRepo.update(
    { id },
    {
      ...job,
    },
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return affected;
}
export async function deleteJob(
  id: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  // const role = transaction.getRepository(dependencies.db.models.role);
  const jobRepo = transaction.getRepository(dependencies.db.models.jobs);
  const applicantRepo = transaction.getRepository(
    dependencies.db.models.application,
  );
  await applicantRepo.delete({ job: { id } });

  const existingJob = await jobRepo.findOne({
    where: { id },
  });
  if (!existingJob) {
    throw new HttpException('Job doesnt exist', HttpStatus.BAD_REQUEST);
  }
  await destroyLink(existingJob.joblink);
  const { affected } = await jobRepo.delete({ id });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return affected;
}
export async function getJobById(
  id: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return

  const jobInfo = await myDataSource.manager
    .getRepository(dependencies.db.models.jobs)
    .findOne({
      where: { id },
      relations: ['applicant'],
    });
  return jobInfo;
}
export async function getRoleById(
  id: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return

  const roleinfo = await myDataSource.manager
    .getRepository(dependencies.db.models.role)
    .findOne({
      where: { id },
      relations: [
        'client',
        'application',
        'interviews',
        'developers',
        'jobs',
        'link',
      ],
    });
  const { link, ...rest } = roleinfo;
  return { link: link?.shortComponent, ...rest };
}
export async function deleteRole(
  id: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
): Promise<number> {
  dependencies = injectDependencies(dependencies, ['db']);
  const jobRepo = transaction.getRepository(dependencies.db.models.jobs);
  const devRepo = transaction.getRepository(dependencies.db.models.developer);
  const applicantionRep = transaction.getRepository(
    dependencies.db.models.application,
  );
  const interviewRepo = transaction.getRepository(
    dependencies.db.models.interviews,
  );
  const hoursRepo = transaction.getRepository(
    dependencies.db.models.clockedHours,
  );

  await hoursRepo.delete({
    role: { id },
  });

  await interviewRepo.delete({
    role: { id },
  });

  await applicantionRep.delete({
    role: { id },
  });

  // Unassign roles from developers and set work status to "Not Active"
  const developers = await devRepo.find({
    where: { roles: { id } },
  });

  for (const developer of developers) {
    developer.roles = null; // Unassign role
    developer.workStatus = 'Not Active';
    await devRepo.save(developer);
  }

  await jobRepo.delete({ role: { id } });

  const { affected } = await transaction
    .getRepository(dependencies.db.models.role)
    .delete({
      id,
    });
  return affected;
}

export const getAllRoles = async (
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) => {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const skip = (1 - 1) * 10;
  const allRoles = await transaction
    .getRepository(dependencies.db.models.role)
    .find({ relations: ['client', 'jobs', 'link'] });
  const newclientData = allRoles.map(({ link, ...rest }) => ({
    link: link?.shortComponent,
    ...rest,
  }));
  return newclientData;
};
export async function updateRole(
  id: string,
  updates: Partial<Omit<IRole, 'jobs'>>,
  transactionParam: EntityManager = null,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);
  const RoleRepo = transactionParam.getRepository(dependencies.db.models.role);
  return await ensureTransaction(
    transactionParam,
    async () => {
      const data = await RoleRepo.update({ id }, { ...updates });
      return data;
    },
    dependencies,
  );
}

export default {
  createRoles,
  getRoleById,
};
