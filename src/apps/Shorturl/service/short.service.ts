// import { ResultBoundary } from '../..';
import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import shortUrl from '../dataManager/shortUrl';
import { Cache } from 'cache-manager';

import { Injectable } from '@nestjs/common/decorators';
import {
  HttpException,
  HttpStatus,
  Inject,
  CACHE_MANAGER,
  Next,
} from '@nestjs/common';
import Roles from '../../../apps/roles/dataManager';

@Injectable()
export class ShortUrlService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  // private readonly userRepository: Repository<UserEntity>, // @InjectRepository(UserEntity)
  async resolveShortUrl(
    shortComponent: string,
    dependencies: Dependencies = null,
  ) /* : Promise<ResolveShortUrlSuccess | ResolveShortUrlFailure>  */ {
    dependencies = injectDependencies(dependencies, ['db']);
    const longComponent = await shortUrl.resolve(shortComponent, dependencies);
    const roleId = longComponent.split('rid=');
    if (!longComponent) {
      throw new HttpException('Link Expired', HttpStatus.BAD_REQUEST);
    }
    const roles = await Roles.getById(roleId[1], dependencies);
    if (!roles && !roles.jobs.length) {
      await shortUrl.destroyLink(shortComponent, dependencies);
      throw new HttpException('This role has expired', HttpStatus.BAD_REQUEST);
    }

    return longComponent;
  }
}
