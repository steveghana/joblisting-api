import { DataSource, DataSourceOptions } from 'typeorm';
import Entities from '../src/Config/model';
import { TypeOrmLogger } from '../src/util/lg';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config(); // load environment variables from .env file
export const dbConnetion: PostgresConnectionOptions = {
  type: 'postgres',
  // url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  logger: new TypeOrmLogger(),
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [...Entities],
  synchronize: process.env.NODE_ENV === 'development',
};

const myDataSource = new DataSource({
  ...dbConnetion,
  database: process.env.DB_NAME || 'postgres',
  migrations: ['./dist/migrations/**/*.js'],
} as DataSourceOptions);
export default myDataSource;
