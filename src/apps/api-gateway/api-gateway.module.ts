import { Module, RequestMethod } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { APP_FILTER } from '@nestjs/core';
import { Modules } from './exports';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { myDataSource } from '../../Config';
import dbConfiguration from '../../Config/db.config';

import { HttpExceptionFilter } from '../../middleware/err.Middleware';
import { CorsMiddleware } from '../../middleware/cors.middleware';
import { AuthMiddleware } from '../../middleware/authenticated.middleware';
import { GoogleAuthMiddleware } from '../../middleware/google.middleware';
@Module({
  imports: [
    CacheModule.register({
      ttl: 5,
      max: 100,
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [dbConfiguration],
    }),
    // database configuration goes here
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        myDataSource
          .initialize()
          .then(async () => {
            console.log('Data Source has been initialized!');
          })
          .catch((err) => {
            console.error('Error during Data Source initialization', err);
          });
        return {
          ...configService.get('database'),
        };
      },
      inject: [ConfigService],
    }),
    ...Modules,
  ],
  controllers: [],
  providers: [
    // AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: AuthenticationTtlMiddleware,
    // },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
// export class AppModule {}
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes('*')
      //AuthTTL
      //OptionalAuth
      .apply(GoogleAuthMiddleware)
      .forRoutes(
        {
          path: '/user/login/google',
          method: RequestMethod.POST,
        },
        {
          path: '/user/register/google',
          method: RequestMethod.POST,
        },
      )
      .apply(AuthMiddleware)
      .forRoutes(
        //advertisement
        {
          path: '/user/update',
          method: RequestMethod.PATCH,
        },
        {
          path: '/user/whoami',
          method: RequestMethod.GET,
        },
        {
          path: '/client/*',
          method: RequestMethod.ALL,
        },
        {
          path: '/developers/*',
          method: RequestMethod.ALL,
        },
      );
  }
}
