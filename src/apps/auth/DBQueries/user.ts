import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import { UserEntity } from '../models/user.entity';
import { EntityManager, In } from 'typeorm';
import { ensureTransaction, useTransaction } from '../../../Config/transaction';
import { IUser } from '../../../types/user';

export function findElseCreateUser(
  email: string,
  user: IUser,
  transactionParam: EntityManager = null,
  dependencies: Dependencies = null,
): Promise<[UserEntity, boolean]> {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return

  return ensureTransaction(
    transactionParam,
    async (transaction) => {
      const userRepo = transaction.getRepository(dependencies.db.models.user);
      const existingUser = (await userRepo.findOne({
        where: { email: email.toLowerCase() },
      })) as unknown as UserEntity;
      if (existingUser) {
        return [existingUser, false];
      }
      const newUser = userRepo.create({ ...user });
      const data = (await userRepo.save(newUser)) as UserEntity;
      return [data, true];
    },
    dependencies,
  );
}

export async function getUser(
  email: string,
  dependencies: Dependencies = null,
): Promise<UserEntity> {
  dependencies = injectDependencies(dependencies, ['db']);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return useTransaction(async (transaction) => {
    const userRepo = transaction.getRepository(dependencies.db.models.user);
    // console.log(email, 'from user db queries');
    const user = (await userRepo.findOne({
      where: {
        email: email.toLowerCase(),
      },
    })) as unknown as UserEntity;
    return user;
  }, dependencies);
}
export async function getUserById(
  id: string,
  dependencies: Dependencies = null,
): Promise<UserEntity> {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return useTransaction(async (transaction) => {
    const userRepo = transaction.getRepository(dependencies.db.models.user);
    const user = (await userRepo.findOne({
      where: {
        id: id,
      },
      relations: ['developer'],
    })) as unknown as UserEntity;
    return user;
  }, dependencies);
}
export async function getUserRoles(
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return useTransaction(async (transaction) => {
    const userRepo = transaction.getRepository(dependencies.db.models.user);
    // console.log(email, 'from user db queries');
    const user = await userRepo.find({});
    return user
      .filter((item) => item.role === 'Ceo' || item.role === 'Recruitment')
      .map((item) => item.role);
  }, dependencies);
}

export function getUsers(
  emails: string[],
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
): Promise<UserEntity[]> {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const userRepo = transaction.getRepository(dependencies.db.models.user);
  return userRepo.find({
    where: {
      email: In([emails]),
    },
  }) as any;
}

export async function createUsers(
  users: (Partial<IUser> & { email: string })[],
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
): Promise<void> {
  dependencies = injectDependencies(dependencies, ['db']);
  const userRepository = transaction.getRepository(UserEntity);
  await userRepository.insert(users);
}

export async function updateUser(
  user: Partial<IUser>,
  transaction: EntityManager,
  dependencies: Dependencies = null,
): Promise<number> {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const userRepo = transaction.getRepository(dependencies.db.models.user);
  const { affected: done } = await userRepo.update(
    { email: user.email.trim().toLowerCase() },
    {
      ...user,
    },
  );
  return done;
}
export async function update(
  user: Partial<IUser>,
  transaction: EntityManager,
  dependencies: Dependencies = null,
): Promise<number> {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const userRepo = transaction.getRepository(dependencies.db.models.user);
  const { affected: done } = await userRepo.update(
    { email: user?.email.trim().toLowerCase() },
    {
      ...user,
    },
  );
  return done;
}
export async function deletUser(
  user: Pick<IUser, 'email' | 'id'>,
  transaction: EntityManager,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);

  const { email, id } = user;
  const userRepo = transaction.getRepository(dependencies.db.models.user);
  const done = await userRepo.delete({ id, email });
  return done;
}
export default {
  findElseCreateUser,
  getUser,
  getUsers,
  createUsers,
  updateUser,
};
