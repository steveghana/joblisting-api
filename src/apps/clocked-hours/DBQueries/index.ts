import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import uuidUtil from '../../../util/uuid';
import { DeepPartial, EntityManager } from 'typeorm';
import myDataSource from '../../../../db/data-source';
import uuid from '../../../util/uuid';
import { Ihours } from '@/types/hours';

export async function createHours(
  developerId: string,
  applicationData: Ihours,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  const developerRepo = transaction.getRepository(
    dependencies.db.models.developer,
  );
  const hours = transaction.getRepository(dependencies.db.models.clockedHours);
  // const exstingrole = await role.findOne({
  //   where: {
  //     id: roleId,
  //   },
  //   // relations: ['client'],
  // });

  const exstingdeveloper = await developerRepo.findOne({
    where: {
      id: developerId,
      // roles:exstingrole
    },
    relations: ['role'],
  });
  let newHours = await hours.create({
    ...exstingdeveloper,
    ...applicationData,
  });
  let data = hours.save(newHours);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return data;
}

export function getHoursByDeveloper(
  id: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return

  return myDataSource.manager
    .getRepository(dependencies.db.models.clockedHours)
    .findOne({
      where: { id },
      relations: ['clockHours'],
    });
}

export default {
  createHours,
  getHoursByDeveloper,
};
