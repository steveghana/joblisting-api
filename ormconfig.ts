// ormconfig.ts
import { ConfigModule } from '@nestjs/config';
import dbConfiguration from '../api/src/Config/db.config';

ConfigModule.forRoot({
  isGlobal: true,
  load: [dbConfiguration],
});

export default dbConfiguration();
