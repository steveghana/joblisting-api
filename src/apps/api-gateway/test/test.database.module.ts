import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { createDatabase, dropDatabase } from 'typeorm-extension';
import Entities from '../../../Config/model';
import * as dotenv from 'dotenv';

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { createTestDataSource } from './test.setup';
import { dbConnetion } from '../../../../db/data-source';
dotenv.config(); // load environment variables from .env file

export class TestDBInitiator {
  private readonly initialDatabase: string;
  private readonly testDatabase = 'test';
  readonly dbOptions: PostgresConnectionOptions;
  readonly configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
    const config: PostgresConnectionOptions = dbConnetion;

    this.initialDatabase = config.database;
    this.dbOptions = {
      ...config,
      database: this.testDatabase,
    };
  }

  async createDatabase() {
    await this.dropDatabase();
    console.log(`Creating test database '${this.dbOptions.database}'`);
    await createDatabase({
      options: this.dbOptions,
      initialDatabase: this.initialDatabase,
      ifNotExist: false,
    });
    const dataSource = await createTestDataSource(this.dbOptions);

    console.log('Running migrations');
    await dataSource.runMigrations();
    await dataSource.destroy();

    console.log('✓ Done. Test database is ready to accept connections ✓\n');
  }

  async dropDatabase(dropAll = false) {
    console.log(`Dropping test database '${this.testDatabase}'`);
    if (dropAll) {
      const ds = await createTestDataSource({
        ...this.dbOptions,
        database: this.initialDatabase,
      });
      await ds.query(
        `SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${this.testDatabase}';`,
      );
    }
    await dropDatabase({
      options: this.dbOptions,
      initialDatabase: this.initialDatabase,
    });
  }
}
