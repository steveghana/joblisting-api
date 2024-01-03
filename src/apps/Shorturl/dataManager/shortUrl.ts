// import cryptoRandomString from 'crypto-random-string';
import { EntityManager } from 'typeorm';
import { IRole } from '../../../types/role';
import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import shortDb from '../DBQueries/shortUrl';
import { Cache } from 'cache-manager';
function generateRandomString(n) {
  let randomString = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < n; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return randomString;
}

class ShortUrl {
  static async resolve(
    shortComponent: string,
    dependencies: Dependencies = null,
  ): Promise<string> {
    dependencies = injectDependencies(dependencies, ['db']);

    const longUrl = await shortDb.resolveShortUrl(shortComponent, dependencies);
    return longUrl && longUrl.longComponent;
  }
  static async destroyLink(
    shortComponent: string,
    dependencies: Dependencies = null,
  ): Promise<number> {
    dependencies = injectDependencies(dependencies, ['db']);

    const longUrl = await shortDb.destroyLink(shortComponent, dependencies);
    return longUrl.affected;
  }

  static async create(
    role: IRole,

    longComponent: string,
    transaction: EntityManager = null,

    dependencies: Dependencies = null,
  ): Promise<string> {
    dependencies = injectDependencies(dependencies, ['db', 'config']);
    // const shortComponent = cryptoRandomString({
    //   length: dependencies.config.shortUrlComponentLength,
    //   type: 'alphanumeric',
    // });
    const shortComponent = generateRandomString(
      dependencies.config.roleUrlComponaentLength,
    );
    await shortDb.create(
      role,
      shortComponent,
      longComponent,
      transaction,
      dependencies,
    );
    return shortComponent;
  }
}

export default ShortUrl;
