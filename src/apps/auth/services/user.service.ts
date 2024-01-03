import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { useTransaction } from '../../../Config/transaction';
import cryptoUtil from '../../../util/crypto';
import User from '../dataManager/userEntity';
import CredentialToken from '../dataManager/credentialToken';
import AuthToken from '../dataManager/authToken';
import { JwtService } from '@nestjs/jwt';
import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';

import { IProfession, IUser } from '../../../types/user';
import { generateAlphanumeric } from '../../../util/transaction';
// import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(private jwtService: JwtService) {}
  async googleLogin(user: IUser, dependencies: Dependencies = null) {
    dependencies = injectDependencies(dependencies, ['db', 'config']);

    if (!user || !user.googleVerified) {
      throw new UnauthorizedException('No user from google');
    }
    const [authToken, userinfo] = await useTransaction(async (transaction) => {
      console.log(user.googleVerified, 'user at google login');
      if (!(await User.getByEmail(user.email, dependencies))) {
        throw new HttpException(
          'User doesnt exists, try signing in',
          HttpStatus.BAD_REQUEST,
        );
      }
      await User.update(
        {
          email: (await User.getByEmail(user.email, dependencies)).email,
        },
        transaction,
      );
      return [
        await AuthToken.createForUser(
          //this returns the token
          user.email,
          null,
          transaction,
          dependencies,
        ),
        await User.getByEmail(user.email, dependencies), // this returns a user data
      ];
    }, dependencies);
    this.logger.debug(`Login successful for user: ${user.email}`);
    return {
      ...{ email: user.email, role: userinfo.role },
      authTokenId: authToken.id,
    };
  }

  /**
   * Registers a new user.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @param {string} firstName - The first name of the user.
   * @param {string} lastName - The last name of the user.
   * @param {IProfession} role - The role of the user.
   * @param {Dependencies} dependencies - The dependencies of the service.
   * @returns {Promise<object>} The user and the authentication token.
   */
  public async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: IProfession,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db', 'config', 'email']);
    const passwordHash = await cryptoUtil.hash(
      password,
      dependencies.config?.authentication?.passwordHashIterations,
    );

    return useTransaction(async (transaction) => {
      const [user, UserMethods] = await User.findElseCreate(
        {
          email,
          role: role || 'Developer',
          firstName,
          lastName,
        },
        passwordHash,
        transaction,
        dependencies,
      );

      if (!(await UserMethods.isNewlyCreated)) {
        throw new HttpException(
          'User already exists, try signing up',
          HttpStatus.BAD_REQUEST,
        );
      }

      await UserMethods.update(
        {
          password: passwordHash,
        },
        transaction,
      );

      const payload = {
        email: user.email,
        password: password,
      };

      this.logger.debug(`Registeration successful for user: ${email}`);

      return {
        ...payload,
        token: this.jwtService.sign(payload),
      };
    });
  }
  public async googleRegister(user: IUser, dependencies: Dependencies = null) {
    dependencies = injectDependencies(dependencies, ['db', 'config', 'email']);
    if (!user) {
      throw new UnauthorizedException('No user from google');
    }
    const primaryimageUrl = user.photos.find(
      (item) => item.metadata.primary === true,
    ).url;
    const userNames: string = user.names.find(
      (item) => item.metadata.primary === true,
    ).displayName;

    const { email, googleVerified, emailAddresses } = user;
    if (!userNames || userNames === '' || !googleVerified) {
      throw new HttpException(
        'Google user cannot be authenticated',
        HttpStatus.BAD_REQUEST,
      );
    }
    const names = userNames.split(' ');
    const password = await generateAlphanumeric(10);
    const passwordHash = await cryptoUtil.hash(
      password,
      dependencies.config?.authentication?.passwordHashIterations,
    );
    return useTransaction(async (transaction) => {
      const [user, UserMethods] = await User.findElseCreate(
        {
          email,
          role: 'Developer',
          firstName: names[0],
          lastName: names[1],
          googleVerified,
          emailAddresses,

          avatar: primaryimageUrl,
        },
        passwordHash,
        transaction,
        dependencies,
      );
      if (!(await UserMethods.isNewlyCreated)) {
        console.log('throwing new exceptions ...........');
        throw new HttpException(
          'User already exists, try signing up',
          HttpStatus.BAD_REQUEST,
        );
      }
      await UserMethods.update(
        {
          password: passwordHash,
        },
        transaction,
      );
      const payload = {
        email: user.email,
        password: password,
      };
      return {
        ...payload,
        token: this.jwtService.sign(payload),
      };
    });
  }

  public async login(
    email: string,
    password: string,
    role: IProfession | null,
    rememberMe = false,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db', 'config']);
    const user = new User(email, dependencies);
    const exists = await user.exists();
    console.log('login started', exists);
    const fakePassword = await cryptoUtil.hash(
      '',
      dependencies.config.authentication.passwordHashIterations,
    );
    const passwordMatches = await (exists
      ? user.passwordMatches(password)
      : cryptoUtil.compare('', fakePassword));

    const passwordIsEmpty = await (exists
      ? user.passwordMatches('')
      : cryptoUtil.compare('', fakePassword));
    if (exists && passwordIsEmpty) {
      throw new HttpException('passwordless user', HttpStatus.BAD_REQUEST);
    }
    console.log(passwordMatches, 'matches');

    if (!exists || (exists && !passwordMatches)) {
      throw new HttpException(
        'User doesnt exist, trying signing up',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [authToken, credentialToken] = await useTransaction(
      async (transaction) => {
        const c = rememberMe
          ? await CredentialToken.createForUser(
              email,
              transaction,
              dependencies,
            )
          : null;
        const a = await AuthToken.createForUser(
          email,
          c && c.id,
          transaction,
          dependencies,
        );
        if (role) {
          await User.update(
            {
              email,
              role,
              isSuperAdmin: role === 'Ceo' ? true : false,
            },
            transaction,
          );
        }
        return [a, c];
      },
      dependencies,
    );
    const payload = { email: user.email, role: role || user.role };

    return {
      ...payload,
      // token: this.jwtService.sign(payload),
      authTokenId: authToken.id,
      credentialTokenUuid: credentialToken && credentialToken.uuid,
    };
  }
  async loginWithCredentialToken(
    credentialTokenUuid: string,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db']);

    const credentialToken = await CredentialToken.getByUuid(
      credentialTokenUuid,
      dependencies,
    );
    if (!credentialToken.exists || credentialToken.isInactive()) {
      throw new HttpException('Credentials required', HttpStatus.BAD_REQUEST);
    }

    const user = new User(credentialToken.userEmail, dependencies);
    if (!(await user.exists())) {
      throw new HttpException(
        'user doesnt exist, try signing up',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (await user.passwordMatches('')) {
      throw new HttpException('passwordless user', HttpStatus.BAD_REQUEST);
    }

    const [newCredentialTokenUuid, authToken] = await useTransaction(
      async (transaction) => {
        const [c] = await Promise.all([
          credentialToken.renewUuid(transaction),
          AuthToken.expireOfCredentialToken(
            credentialToken.id,
            transaction,
            dependencies,
          ),
        ]);
        const a = await AuthToken.createForUser(
          credentialToken.userEmail,
          credentialToken.id,
          transaction,
          dependencies,
        );
        return [c, a];
      },
      dependencies,
    );

    return {
      authTokenId: authToken.id,
      credentialTokenUuid: newCredentialTokenUuid,
    };
  }

  async logout(
    authTokenId: string,
    credentialTokenUuid: string,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db']);

    const authToken = new AuthToken(authTokenId, dependencies);
    await Promise.all([
      authToken.deactivate(),
      CredentialToken.deactivateByUuid(credentialTokenUuid, dependencies),
    ]);
    // return new LogoutSuccess();
  }
  async update(
    user: Partial<IUser>,
    role: IProfession,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db']);
    return await useTransaction(async (transaction) => {
      console.log(user, 'from user');
      if (!role || !user.email) {
        throw new HttpException(
          'Couldnt update this user',
          HttpStatus.BAD_REQUEST,
        );
      }

      const userupdated = await User.update(user, transaction, dependencies);
      if (!userupdated) {
        throw new HttpException(
          'Couldnt update this user',
          HttpStatus.BAD_REQUEST,
        );
      }
      return userupdated;
    }, dependencies);
    // const authToken = new AuthToken(authTokenId, dependencies);
  }
  async getUsersRoles(dependencies: Dependencies = null) {
    dependencies = injectDependencies(dependencies, ['db']);
    return await useTransaction(async (transaction) => {
      const userupdated = await User.getUserRoles(transaction, dependencies);
      return userupdated;
    }, dependencies);
    // const authToken = new AuthToken(authTokenId, dependencies);
  }
  /**
   * Fetches a user by their id.
   * @param {string} id - The id of the user.
   * @param {Dependencies} dependencies - The dependencies of the service.
   * @returns {Promise<UserEntity>} The user.
   */
  async getUserById(id: string, dependencies: Dependencies = null) {
    dependencies = injectDependencies(dependencies, ['db']);
    return await useTransaction(async (transaction) => {
      const user = await User.getById(id, dependencies);
      return user;
    }, dependencies);
    // const authToken = new AuthToken(authTokenId, dependencies);
  }
}
