// import { EntityManager } from 'sequelize';
import { addDays } from 'date-fns';
import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';

import ShortUrl from '../dataManager/shortUrl';
import config from '../../../Config/config';
import { IRole } from '../../../types/role';
import { EntityManager } from 'typeorm';

export async function createRoleLink(
  clientId: string,
  role: IRole,
  transaction: EntityManager = null,

  dependencies: Dependencies = null,
): Promise<string> {
  dependencies = injectDependencies(dependencies, ['db']);
  const prefix =
    process.env.NODE_ENV === 'production'
      ? `${config.roleUrl}/s/`
      : 'http://localhost:5173/s/';
  const longUrlComponent = `/c/${encodeURIComponent(
    clientId,
  )}/?rid=${encodeURIComponent(role.id)}`;
  console.log('creatingkdfkjdkfj dfjdkfj');
  const shortUrlComponent = await ShortUrl.create(
    role,
    longUrlComponent,
    transaction,
    dependencies,
  );
  console.log(prefix + encodeURIComponent(shortUrlComponent));
  return prefix + encodeURIComponent(shortUrlComponent);
}
