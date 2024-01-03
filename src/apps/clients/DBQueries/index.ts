import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import uuidUtil from '../../../util/uuid';
import { DeepPartial, EntityManager } from 'typeorm';
import { Client } from '../entities/client.entity';
import myDataSource from '../../../../db/data-source';
import uuid from '../../../util/uuid';
import { IClient } from '../../../types/client';
import { ensureTransaction } from '../../../Config/transaction';
import { ClientFormDataDto } from '../dto/create-client.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
export const getAllClients = async (
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) => {
  dependencies = injectDependencies(dependencies, ['db']);

  const clientRepository = transaction
    ? transaction.getRepository(dependencies.db.models.client)
    : myDataSource.manager.getRepository(dependencies.db.models.client);

  const allClientData = await clientRepository
    .createQueryBuilder('client')
    .leftJoinAndSelect('client.roles', 'role')
    .leftJoinAndSelect('role.jobs', 'job')
    .leftJoinAndSelect('client.developers', 'developer')
    .getMany();

  const formattedClientData = allClientData.map(({ roles, ...rest }) => ({
    roles: roles.map(({ link, ...others }) => ({
      link: link?.shortComponent,
      ...others,
    })),
    ...rest,
  }));

  return formattedClientData;
};

export function findElseCreateClient(
  email: string,
  clientInfo: IClient & { communicationPreferences?: string },
  transactionParam: EntityManager = null,
  dependencies: Dependencies = null,
): Promise<[Client, boolean]> {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return

  return ensureTransaction(
    transactionParam,
    async (transaction) => {
      const clientRepo = transaction.getRepository(
        dependencies.db.models.client,
      );
      const existingClient = (await clientRepo.findOne({
        where: { email: email.toLowerCase() },
      })) as unknown as Client;
      if (existingClient) {
        return [existingClient, false];
      } else {
        const newClient = clientRepo.create({
          ...clientInfo,
        });
        const savedClient = await clientRepo.save(newClient);
        console.log('this is the saved data...........');
        return [savedClient, true];
      }
    },
    dependencies,
  );
}

export async function getClientById(
  id: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);

  const clientRepository = transaction
    ? transaction.getRepository(dependencies.db.models.client)
    : myDataSource.manager.getRepository(dependencies.db.models.client);

  const clientData = await clientRepository
    .createQueryBuilder('client')
    .where('client.id = :id', { id })
    .leftJoinAndSelect('client.roles', 'roles')
    .leftJoinAndSelect('roles.jobs', 'job')
    .leftJoinAndSelect('roles.link', 'link')
    .leftJoinAndSelect('client.developers', 'developers')
    .leftJoinAndSelect('developers.user', 'user')
    .leftJoinAndSelect('developers.clockHours', 'clockHours')
    .getOne();

  if (!clientData) {
    return null;
  }

  const { roles, ...rest } = clientData;
  const formattedRoles = roles.map(({ link, ...others }) => ({
    link: link?.shortComponent,
    ...others,
  }));

  return { ...rest, roles: formattedRoles } as unknown as IClient;
}

export async function deleteClient(
  id: string,
  roleIds: string[],
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
): Promise<number> {
  dependencies = injectDependencies(dependencies, ['db']);

  const roles = transaction.getRepository(dependencies.db.models.role);
  const job = transaction.getRepository(dependencies.db.models.jobs);
  const applicant = transaction.getRepository(
    dependencies.db.models.application,
  );
  const devRepo = transaction.getRepository(dependencies.db.models.developer);
  const interview = transaction.getRepository(
    dependencies.db.models.interviews,
  );
  const clock_hours = transaction.getRepository(
    dependencies.db.models.clockedHours,
  );
  //TODO: Add role relationtions to roleshort url for deleting.
  const url = transaction.getRepository(dependencies.db.models.roleShortUrl);
  // Unassign developers related to roles and clients first to avoid primary key constraints with sub relations
  const developers = await devRepo.find({
    where: { client: { id } },
  });

  for (const developer of developers) {
    developer.roles = null; // Unassign role
    developer.client = null;
    developer.workStatus = 'Not Active';
    if (developer.role_status === 'Interviewing') {
      developer.role_status = 'Pending';
    }
    await devRepo.save(developer);
  }

  if (roleIds.length) {
    // Delete related entities in a specific order according to their relation from client to nested child relations
    // This is done to handle cascading deletions and dependencies between entities to avoid primary key constraint errors

    // Delete clocked hours related to roles
    await Promise.all(
      roleIds.map(async (roleid) => {
        await clock_hours.delete({ role: { id: roleid } });
      }),
    );

    // Delete interviews related to roles
    await Promise.all(
      roleIds.map(async (roleid) => {
        await interview.delete({ role: { id: roleid } });
      }),
    );
    // Delete applicants related to roles
    await Promise.all(
      roleIds.map(async (roleid) => {
        await applicant.delete({ role: { id: roleid } });
      }),
    );

    // Delete jobs related to roles
    await Promise.all(
      roleIds.map(async (roleid) => {
        await job.delete({ role: { id: roleid } });
      }),
    );
    // Delete roles themselves
    await Promise.all(
      roleIds.map(async (roleid) => {
        await roles.delete({ id: roleid });
      }),
    );
  }

  // Delete the main client entity
  const { affected } = await transaction
    .getRepository(dependencies.db.models.client)
    .delete({
      id,
    });

  // Return the number of affected rows
  return affected;
}
export async function updateClient(
  id: string,
  updates: Partial<IClient>,
  transactionParam: EntityManager = null,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);
  const clientRepo = transactionParam.getRepository(
    dependencies.db.models.client,
  );
  return await ensureTransaction(
    transactionParam,
    async (transaction) => {
      const data = await clientRepo.update({ id }, { ...updates });
      return data;
    },
    dependencies,
  );
}
export default {
  getAllClients,
  updateClient,
  deleteClient,
  // createClient,
  getClientById,
  findElseCreateClient,
};
