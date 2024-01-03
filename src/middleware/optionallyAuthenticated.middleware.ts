import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Dependencies, injectDependencies } from '../util/dependencyInjector';
import AuthToken from '../apps/auth/dataManager/authToken';

export type IMockRequest = any;
export type IMockResponse = any;
export type IMockNextFunction = (err?: Error) => void;

type RequestType = Request | IMockRequest;
type ResponseType = Response | IMockResponse;
type NextFunctionType = NextFunction | IMockNextFunction;

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
  private readonly dependencies: Dependencies = null;
  async use(req: RequestType, _res: ResponseType, next: NextFunctionType) {
    const authTokenId = req.headers.authorization;
    if (!authTokenId) {
      next();
      return;
    }
    const authToken = await AuthToken.getWithUser(
      authTokenId,
      injectDependencies(this.dependencies, ['db']),
    );

    // if (!authToken || authToken.isInactive()) {
    //   next();
    //   return;
    // }
    req.requestingAuthToken = authToken;
    req.requestingUser = authToken.user;

    next();
  }
}
