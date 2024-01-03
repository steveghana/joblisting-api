import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import {
  LessThanOrEqual,
  IsNull,
  Brackets,
  Not,
  MoreThanOrEqual,
  EntityManager,
} from 'typeorm';
import { ShortUrlEntity } from '../model/shortUrl.entity';
import { Cache } from 'cache-manager';
import myDataSource from '../../../../db/data-source';
import { IRole } from '../../../types/role';

export async function destroyLink(
  shortLink: string,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);
  const shortRepo = myDataSource.manager.getRepository(
    dependencies.db.models.roleShortUrl,
  );
  return await shortRepo.delete({ shortComponent: shortLink });
}

async function resolveShortUrl(
  shortComponent: string,
  dependencies: Dependencies = null,
): Promise<{ longComponent: string }> {
  dependencies = injectDependencies(dependencies, ['db']);

  const shortRepo = myDataSource.manager.getRepository(
    dependencies.db.models.roleShortUrl,
  );
  // let item = await
  // console.log(item, shortComponent, 'from short');

  const [shortUrl] = await Promise.all([
    shortRepo.findOne({
      where: {
        shortComponent,
      },
    }),
  ]);
  return shortUrl;
}

export async function create(
  role: IRole,
  shortComponent: string,
  longComponent: string,
  transaction: EntityManager = null,

  dependencies: Dependencies = null,
): Promise<{ shortComponent: string }> {
  dependencies = injectDependencies(dependencies, ['db']);

  // Create and save ShortUrlEntity
  const shortRepo = transaction.getRepository(
    dependencies.db.models.roleShortUrl,
  );
  const shortEntity = shortRepo.create({
    shortComponent,
    longComponent,
  });
  const savedShortEntity = await shortRepo.save(shortEntity);

  // Associate ShortUrlEntity with Role entity
  const roleRepo = transaction.getRepository(dependencies.db.models.role);
  const roleEntity = await roleRepo.findOne({ where: { id: role.id } });
  roleEntity.link = savedShortEntity;

  // Save the Role entity with the associated ShortUrlEntity
  const savedRoleEntity = await roleRepo.save(roleEntity);

  console.log(savedRoleEntity, 'Saved Role with Link');

  return { shortComponent };
}

export default {
  destroyLink,
  resolveShortUrl,
  create,
};
