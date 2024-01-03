import { registerAs } from '@nestjs/config';
import Entities from './model';
import { ConfigService } from '@nestjs/config';
import config from './config';
import { TypeOrmLogger } from '../util/lg';

export default registerAs('database', () => ({
  type: 'postgres',
  logging: true,
  // url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'postgres',

  autoLoadEntities: true,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },

  ssl: {
    rejectUnauthorized: false,
  }, // enable SSL/TLS
  dateStrings: true,
  logger: new TypeOrmLogger(),

  entities: Object.values(Entities),
  migrations: ['./dist/migrations/**/*.js'],
  cli: {
    migrationsDir: 'src/apps/migrations/*.js',
  },
}));
