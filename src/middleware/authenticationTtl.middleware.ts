import { Dependencies } from '../util/dependencyInjector';
import AuthToken from '../apps/auth/dataManager/authToken';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
export type IMockRequest = any;
export type IMockResponse = any;
export type IMockNextFunction = (err?: Error) => void;

import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
const excludedRoutesRegex = [
  /client\/\w+\/role\/\w+\/get\//,
  /\/user\//,
  /\/devs\//,
  /\/roleshor\//,
  /\/email\//,
];
@Injectable()
export class AuthenticationTtlMiddleware implements NestInterceptor {
  private readonly dependencies: Dependencies = null;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      console.log(
        'AuthenticationTtlMiddleware entered, for token try',
        process.env.NODE_ENV,
      );
      const authTokenId = context.switchToHttp().getRequest()
        .headers.authorization;
      const request = context.switchToHttp().getRequest();
      // check if the current request URL is in the excluded routes array
      if (excludedRoutesRegex.some((regex) => regex.test(request.url))) {
        return next.handle();
      }

      if (!authTokenId) {
        return next.handle();
      }
      const authToken = new AuthToken(authTokenId, this.dependencies);
      void authToken.updateLastUsed();
      void AuthToken.housekeep(this.dependencies);

      return next.handle();
    } catch (error) {
      console.log(error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
