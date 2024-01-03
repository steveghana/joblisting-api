import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import { EntityManager, In } from 'typeorm';
import myDataSource from '../../../../db/data-source';
import { IDev } from '@/types/developer';
import { ensureTransaction } from '../../../Config/transaction';
import { HttpException, HttpStatus } from '@nestjs/common';

export async function enrollDev(
  devDataset: IDev,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  const devRepo = transaction.getRepository(dependencies.db.models.developer);
  const userRepo = transaction.getRepository(dependencies.db.models.user);
  const { user, devProfession, ...rest } = devDataset;
  const newUser = await userRepo.create({
    ...user,
    role: 'Developer',
  });
  await userRepo.save(newUser);
  const dev = await devRepo.create({
    ...rest,
    user: newUser,
  });
  const devData = await devRepo.save(dev);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return devData as unknown as IDev;
}
export const getAllDevs = async (
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) => {
  dependencies = injectDependencies(dependencies, ['db']);
  const devRepo = transaction.getRepository(dependencies.db.models.developer);
  // const devs = await devRepo.find({ relations: ['client', 'roles', 'job'] }); // User querybuilder for fetching cross related models
  // Fetch developers with roles, client, user, job, and guest interviews
  const developersWithInterviews = await devRepo
    .createQueryBuilder('developer')
    .leftJoinAndSelect('developer.roles', 'roles')
    .leftJoinAndSelect('developer.client', 'client')
    .leftJoinAndSelect('developer.user', 'user')
    .leftJoinAndSelect('developer.job', 'job')
    .leftJoinAndSelect('developer.guestInterviews', 'interviewAsGuest')
    // .leftJoinAndSelect('developer.candidateInterview', 'candidate')// eager loading not working
    .getMany();

  // Fetch interviews with candidate and guests separately and update them based on the
  // developer ID candidate relation is not loading
  const interviews = await transaction
    .getRepository(dependencies.db.models.interviews)
    .find({
      where: {
        candidate: { id: In(developersWithInterviews.map((item) => item.id)) },
      },
      relations: ['candidate', 'guests'],
    });
  // Map interviews to developers based on developer ID, including guests
  const interviewsMap = interviews.reduce((acc, interview) => {
    // Include the candidate
    const candidateDeveloperId = interview.candidate.id;
    if (!acc[candidateDeveloperId]) {
      acc[candidateDeveloperId] = [];
    }
    acc[candidateDeveloperId].push(interview);

    // Include guests
    if (interview.guests && interview.guests.length > 0) {
      interview.guests.forEach((guestDeveloper) => {
        const guestDeveloperId = guestDeveloper.id;
        if (!acc[guestDeveloperId]) {
          acc[guestDeveloperId] = [];
        }
        acc[guestDeveloperId].push(interview);
      });
    }

    return acc;
  }, {});

  // console.log(interviews, 'from interviews');

  // Merge interviews into developersWithInterviews array
  // Merge interviews into developersWithInterviews array
  const developersWithMergedInterviews = developersWithInterviews.map(
    (developer) => {
      const developerId = developer.id;
      const developerInterviews = interviewsMap[developerId] || [];

      // Separate candidate and guest interviews
      const candidateInterviews = developerInterviews.filter(
        (interview) => interview.candidate.id === developerId,
      );

      // Ensure candidateInterviews is a single interview or null
      const candidateInterview =
        candidateInterviews.length > 0 ? candidateInterviews[0] : null;

      const guestInterviews = developerInterviews.filter((interview) =>
        interview.guests.some((guest) => guest.id === developerId),
      );

      return { ...developer, candidateInterview, guestInterviews };
    },
  );

  return developersWithMergedInterviews;
};

export async function getDevById(
  id: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const dev = await myDataSource.manager
    .getRepository(dependencies.db.models.developer)
    .findOne({
      where: { id },
      relations: [
        'clockHours',
        'roles',
        'user',
        'candidateInterview',
        'guestInterviews',
      ],
    });
  return dev as unknown as IDev;
}
export async function updateDev(
  id: string,
  updates: Partial<IDev>,
  transactionParam: EntityManager = null,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);
  const devRepo = transactionParam.getRepository(
    dependencies.db.models.developer,
  );

  return await ensureTransaction(
    transactionParam,
    async (transaction) => {
      const data = await devRepo.update(
        { id },
        {
          ...updates,
        },
      );
      return data;
    },
    dependencies,
  );
}
export async function deleteDev(
  id: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
): Promise<number> {
  dependencies = injectDependencies(dependencies, ['db']);
  const developerRepo = transaction.getRepository(
    dependencies.db.models.developer,
  );
  const existingDev = await developerRepo.findOne({ where: { id } });
  //Handling interview and hours foreign key constraints
  if (existingDev?.guestInterviews?.length > 0) {
    existingDev.guestInterviews = null;
    developerRepo.save(existingDev);
  }
  if (existingDev?.candidateInterview) {
    existingDev.candidateInterview = null;
    developerRepo.save(existingDev);
  }
  if (existingDev?.clockHours?.length > 0) {
    existingDev.clockHours = null;
    developerRepo.save(existingDev);
  }
  const { affected } = await developerRepo.delete({
    id,
  });
  return affected;
}
export async function unassignToRole(
  devId: string,
  roleId: string,
  clientId: string,
  jobId: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);
  const developerRepo = transaction.getRepository(
    dependencies.db.models.developer,
  );
  const rolesRepo = transaction.getRepository(dependencies.db.models.role);
  const clientRepo = transaction.getRepository(dependencies.db.models.client);
  const devRepo = transaction.getRepository(dependencies.db.models.developer);
  const existingRole = await rolesRepo.findOne({ where: { id: roleId } });
  const existingClient = await clientRepo.findOne({ where: { id: clientId } });
  const _rolesWithoutCurrentDeveloper = (
    await rolesRepo.findOne({ where: { id: roleId } })
  ).developers.filter((d) => d.id !== devId);
  const _clientWithoutCurrentDeveloper = (
    await rolesRepo.findOne({ where: { id: clientId } })
  ).developers.filter((d) => d.id !== devId);
  const existingDev = await devRepo.findOne({ where: { id: devId } });
  if (!existingRole?.developers?.length) {
    existingRole.developers = [..._rolesWithoutCurrentDeveloper];
  }

  if (!existingClient?.developers?.length) {
    existingClient.developers = [..._clientWithoutCurrentDeveloper];
  }
  await rolesRepo.save(existingRole);
  await clientRepo.save(existingClient);
  const developerSaved = await developerRepo.save(existingDev);

  return developerSaved;
}
export async function assignToRole(
  id: string,
  roleId: string,
  clientId: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);
  const developerRepo = transaction.getRepository(
    dependencies.db.models.developer,
  );
  const rolesRepo = transaction.getRepository(dependencies.db.models.role);
  const clientRepo = transaction.getRepository(dependencies.db.models.client);
  const devRepo = transaction.getRepository(dependencies.db.models.developer);

  const existingRole = await rolesRepo.findOne({
    where: { id: roleId },
    relations: ['developers'],
  });
  const existingClient = await clientRepo.findOne({
    where: { id: clientId },
    relations: ['developers'],
  });
  const existingDev = await devRepo.findOne({ where: { id } });
  // ManyToMany relationship between Developer and Role
  if (!existingRole?.developers?.length) {
    existingRole.developers = [existingDev];
  } else {
    existingRole.developers = [...existingRole.developers, existingDev];
  }
  // ManyToMany relationship between Client and Developer
  if (!existingClient?.developers?.length) {
    existingClient.developers = [existingDev];
  } else {
    existingClient.developers = [...existingClient.developers, existingDev];
  }

  await rolesRepo.save(existingRole);
  const devAssigned = await clientRepo.save(existingClient);
  return devAssigned;
}

export async function bulkdeleteDevs(
  id: string[],
  transaction: EntityManager,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);
  // const jobRepo = transaction.getRepository(dependencies.db.models.jobs);
  const devRepo = transaction.getRepository(dependencies.db.models.developer);
  const deleted = await Promise.all(
    devRepo.delete({
      id: In([id]),
    }) as any,
  );
  const { affected } = deleted[0];
  return affected;
}

export default {
  enrollDev,
  deleteDev,
  getAllDevs,
  updateDev,
  getDevById,
};
