import { DynamicModule, INestApplication, NestModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import {
  ConnectionOptions,
  DataSource,
  DataSourceOptions,
  createConnection,
} from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TestDBInitiator } from './test.database.module';

export async function setupTestApp(
  testDatabaseOptions: DataSourceOptions,
  modules: DynamicModule[],
): Promise<INestApplication> {
  const testingModuleBuilder: TestingModule = await Test.createTestingModule({
    imports: [TypeOrmModule.forRoot(testDatabaseOptions), ...modules],
  }).compile();

  const app = testingModuleBuilder.createNestApplication();
  await app.init();

  return app;
}

export async function setupTestDatabase(
  options: ConnectionOptions,
): Promise<void> {
  const connection = await createConnection(options);
  await connection.runMigrations();
}
export async function createTestDataSource(
  dbOptions: PostgresConnectionOptions,
) {
  const dataSource = new DataSource(dbOptions);
  await dataSource.initialize();
  return dataSource;
}
export async function closeTestDatabase(
  options: ConnectionOptions,
): Promise<void> {
  const connection = await createConnection(options);
  await connection.close();
}

dotenv.config();

module.exports = async () => {
  console.log('\n\nSetup test environment');
  globalThis.databaseConfig = new TestDBInitiator();
  await globalThis.databaseConfig.createDatabase();
};
