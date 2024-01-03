import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import {
  getUser,
  updateUser,
  getUserRoles,
  getUserById,
  getUsers,
  createUsers,
  findElseCreateUser,
  deletUser,
} from '../DBQueries/user';
import cryptoUtil from '../../../util/crypto';
import { UserEntity } from '../models/user.entity';
import { EntityManager } from 'typeorm';
import { IUser } from '../../../types/user';
import { HttpException, HttpStatus } from '@nestjs/common';
// This creates a new type that has all the properties of UserEntity but makes them optional
type PartialUserEntity = Partial<UserEntity>;

// This creates a new type that has only the properties of UserEntity that you want
type IUserEntity = Pick<
  PartialUserEntity,
  keyof Omit<IUser, 'address' | 'names' | 'photos'>
>;
class User {
  private _email: string = null;
  private data: IUserEntity = null;
  private dependencies: Dependencies = null;
  private _isNewlyCreated = false;

  private async getDataIfNeeded() {
    if (!this.data && this._email) {
      this.data = await getUser(this._email, this.dependencies);
    }
  }

  constructor(email: string, dependencies: Dependencies = null) {
    this.dependencies = injectDependencies(dependencies, ['db']);
    this._email = email && email.trim().toLowerCase();
  }

  static async findOrCreate(
    user: IUser,
    passwordHash: string,
    transaction: EntityManager,
    dependencies: Dependencies = null,
  ): Promise<User> {
    dependencies = injectDependencies(dependencies, ['db']);
    const [userData, isNewlyCreated] = await findElseCreateUser(
      user.email.trim().toLowerCase(),
      {
        email: user.email.trim().toLowerCase(),
        password: passwordHash,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        googleVerified: user.googleVerified,
        emailAddresses: user.emailAddresses,
      },
      transaction,
      dependencies,
    );
    const newUser = new User(user.email, dependencies);
    newUser.data = userData;
    newUser._isNewlyCreated = isNewlyCreated;
    return newUser;
  }

  static async findElseCreate(
    user: IUser,
    passwordHash: string,
    transaction: EntityManager,
    dependencies: Dependencies = null,
  ): Promise<[IUser, User]> {
    dependencies = injectDependencies(dependencies, ['db']);
    const [userData, isNewlyCreated] = await findElseCreateUser(
      user.email.trim().toLowerCase(),
      {
        email: user.email.trim().toLowerCase(),
        password: passwordHash,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
      transaction,
      dependencies,
    );
    const newUser = new User(user.email, dependencies);
    (newUser.data as unknown) = userData;
    (newUser._isNewlyCreated as unknown) = isNewlyCreated;
    return [userData, newUser];
  }

  static async getByEmail(emails: string, dependencies: Dependencies = null) {
    dependencies = injectDependencies(dependencies, ['db']);
    const userDatas = await getUser(emails, dependencies);
    if (userDatas?.email) {
      const user = new User(userDatas.email, dependencies);
      user.data = userDatas;
      return user.data;
    }
    return userDatas;
  }
  static getById(id: string, dependencies: Dependencies = null) {
    dependencies = injectDependencies(dependencies, ['db']);
    return getUserById(id, dependencies);
  }
  static async update(
    user: Partial<IUser>,
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db']);
    const userUpdated = await updateUser(user, transaction, dependencies);
    // console.log(userDatas, 'user')
    return userUpdated;
  }
  static async getUserRoles(
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db']);
    const userUpdated = await getUserRoles(transaction, dependencies);
    // console.log(userDatas, 'user')
    return userUpdated;
  }

  static async bulkCreate(
    users: (Partial<IUser> & { email: string })[],
    transaction: EntityManager = null,
    dependencies: Dependencies = null,
  ): Promise<void> {
    dependencies = injectDependencies(dependencies, ['db']);
    await createUsers(users, transaction, dependencies);
  }
  static async destroy(
    user: Pick<IUser, 'email' | 'id'>,
    transaction: EntityManager,
    dependencies: Dependencies = null,
  ) {
    const done = await deletUser(user, transaction, dependencies);
    return done;
  }

  async exists(): Promise<boolean> {
    await this.getDataIfNeeded();
    return !!this.data;
  }

  async passwordMatches(password: string): Promise<boolean> {
    await this.getDataIfNeeded();
    console.log(password, this.password, 'dfdfd;fdk');
    return cryptoUtil.compare(password, this.data.password);
  }
  async update(
    user: Partial<Omit<IUser, 'email'>>,
    transaction: EntityManager,
  ): Promise<any> {
    const newData = { ...user, email: this._email };
    const done = await updateUser(newData, transaction, this.dependencies);

    this.data = {
      ...this.data,
      ...newData,
    };
    return done;
  }

  async isLocked(): Promise<boolean> {
    await this.getDataIfNeeded();
    return this.data.role !== null;
  }

  get password(): Promise<string> {
    return this.getDataIfNeeded().then(() => {
      return this.data.password;
    });
  }

  get email(): string {
    return this._email;
  }
  get role(): string {
    return this.data.role;
  }

  get isNewlyCreated(): boolean {
    return this._isNewlyCreated;
  }

  // get lockReason(): string {
  //   return this.getDataIfNeeded().then(() => this.data.role).catch();
  // }
}

export default User;
