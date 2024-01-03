import { AppModule } from '../../../apps/api-gateway/api-gateway.module';
import { TestDBInitiator } from '../../../apps/api-gateway/test/test.database.module';
import { createTestDataSource } from '@/apps/api-gateway/test/test.setup';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// Import Supertest
import * as request from 'supertest';
import { UserEntity } from '../models/user.entity';
import { IUser } from '@/types/user';

describe('authcontroller (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let databaseConfig: TestDBInitiator;
  const authUrl = `http://localhost:5000/auth`;

  const mockUser: IUser = {
    firstName: 'givenName',
    role: 'Ceo',
    lastName: 'familyName',
    email: 'email@homtail.com',
    password: 'password',
  };
  beforeAll(async () => {
    databaseConfig = new TestDBInitiator();
    dataSource = await createTestDataSource(databaseConfig.dbOptions);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...databaseConfig.dbOptions,
          autoLoadEntities: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('it should register a user and return the new user object', () => {
    return request(authUrl)
      .post('/register')
      .set('Accept', 'application/json')
      .send(mockUser)
      .expect((response: request.Response) => {
        const { email, password, token } = response.body;

        expect(email).toEqual(mockUser.email), expect(password).toBeUndefined();
        expect(token).toBeDefined();
      })
      .expect(HttpStatus.CREATED);
  });
  it('/user/register (POST) should register a new user', async () => {
    const data = {
      user: {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Recruitment',
        country: 'US',
      },
    };

    const response = await request(app.getHttpServer())
      .post('/user/register')
      .send(data)
      .expect((response: request.Response) => {
        const { email, password, token } = response.body;

        expect(email).toEqual(data.user.email),
          expect(password).toBeUndefined();
        expect(token).toBeDefined();
        expect(response.body).toHaveProperty('token');
      })
      .expect(HttpStatus.CREATED);

    // Assuming you have a user entity in your database
    // const userRepository = dataSource.getRepository(User);
    // const createdUser = await userRepository.findOne({
    //   email: data.user.email,
    // });
    // expect(createdUser).toBeDefined();
    // expect(createdUser.firstName).toEqual(data.user.firstName);
  });

  it('/user/login (POST) should login a user', async () => {
    const data = {
      email: 'test@example.com',
      password: 'password123',
      role: 'Recruitment',
      rememberMe: false,
    };

    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send(data)
      .expect((response: request.Response) => {
        const { email, token, role } = response.body;

        expect(email).toEqual(data.email),
          expect(role).toEqual(data.role),
          expect(token).toBeDefined();
        expect(response.body).toHaveProperty('token');
      })
      .expect(HttpStatus.CREATED);
    // Assuming that your AuthService returns some response object
    expect(response.body).toHaveProperty('token');
  });

  // Add more test cases for other controller methods as needed
});
