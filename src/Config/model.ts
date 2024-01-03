// import { QueueAreaTrait as queueAreaTrait } from '@/apps/business/src/models/AreaTraits/queueAreaTrait.entity';
import { AuthtokenEntity as authToken } from '../apps/auth/models/Token/authToken.entity';
import { CredentialTokenEntity as credentialToken } from '../apps/auth/models/CredentialToken/credentialToken.entity';
import { UserEntity as user } from '../apps/auth/models/user.entity';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { Application as application } from '../apps/applications/entities/application.entity';
import { Role as role } from '../apps/roles/entities/role.entity';
import { Interview as interviews } from '../apps/interviews/entities/interview.entity';
import { Developer as developer } from '../apps/developers/entities/developer.entity';
import { ClockHours as clockedHours } from '../apps/clocked-hours/entities/clocked-hour.entity';
import { Client as client } from '../apps/clients/entities/client.entity';
import { Job as jobs } from '../apps/roles/entities/jobs.entity';
import { ShortUrlEntity as roleShortUrl } from '../apps/Shorturl/model/shortUrl.entity';
import { Comment as comments } from '../apps/interviews/entities/comments.entity';
type RepositoryType<T extends ObjectLiteral> = Repository<T>;
export type Repositories = {
  authToken: RepositoryType<authToken>;
  user: RepositoryType<user>;
  credentialToken: RepositoryType<credentialToken>;
  // applications: Rep
  // add other entities here with their respective RepositoryTypes
};

export function createRepositories(
  entities: any[],
  myDataSource: DataSource,
): Repositories {
  return entities.reduce((acc, entity) => {
    const name = entity.name.toLowerCase();
    acc[name] = myDataSource.getRepository(entity);
    return acc;
  }, {} as Repositories);
}

export const EntitiesRepositoryMap = {
  authToken,
  credentialToken,
  roleShortUrl,
  user,
  application,
  role,
  interviews,
  developer,
  jobs,
  clockedHours,
  client,
  comments,
};

const Entities = [
  authToken,
  credentialToken,
  jobs,
  roleShortUrl,
  user,
  application,
  role,
  interviews,
  developer,
  clockedHours,
  client,
  comments,
];

// export { repositories };
export default Entities;
