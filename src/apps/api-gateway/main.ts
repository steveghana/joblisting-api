import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AddressInfo } from 'net';
import * as http from 'http';
import emailUtil from '../../util/email';
import { createServer, Server } from 'https';
import { WinstonModule } from 'nest-winston';
import config from '../../Config/config';
import helmet from 'helmet';
import { AppModule } from './api-gateway.module';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createDocument } from './swagger/swagger';
import * as winston from 'winston';
import { Logger, ValidationPipe, Next } from '@nestjs/common';
import { HttpExceptionFilter } from '../../middleware/err.Middleware';
import { generateAndPersistData } from '../Faker';
export function getPort(): number {
  // If port is omitted or is 0, the operating system will assign an arbitrary unused port
  return process.env.NODE_ENV === 'test'
    ? 0
    : Number(process.env.PORT) || config.restApiPort;
}

export async function init() {
  const expressApp = express();
  const logger = WinstonModule.createLogger({
    level: 'debug',
    transports: [new winston.transports.Console()],
  });

  // Creating NestJS application with Express adapter
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: new Logger() },
  );

  app.use(helmet());

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors();
  app.useLogger(new Logger());
  app.useGlobalFilters(new HttpExceptionFilter());
  expressApp.use(express.urlencoded({ extended: false }));
  expressApp.use(express.json({ limit: '5mb' }));
  // app.use((req, res, next) => {
  //   res.json('Server now started');
  //   next();
  // });
  // Initialize HTTP server
  let server: http.Server | Server;
  if (process.env.NODE_ENV !== 'production' && config.development.useHttps) {
    server = createServer(expressApp);
  } else {
    server = http.createServer(expressApp);
  }

  emailUtil.init();
  app.init();
  server.listen(5000, () => {
    const addr: AddressInfo = server.address() as AddressInfo;
    logger.log('api', `Now listening on port ${getPort()}`);
  });
  logger.log('api', `Now listening on port faker`);
  // generateAndPersistData();

  process.on('SIGINT', async () => {
    logger.log('api', 'Shutting down gracefully...');
    await app.close();
    server.close();
    process.exit(0);
  });

  SwaggerModule.setup('api/v1', app, createDocument(app));
}
init();
