import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
export class AuthMiddleware implements NestMiddleware {
  private readonly dependencies: Dependencies = null;
  // constructor(private readonly dependencies: Dependencies = null) {
  //     this.dependencies = injectDependencies(dependencies, ['db']);
  // }

  async use(req: RequestType, res: ResponseType, next: NextFunctionType) {
    try {
      console.log('Authenticate middleware entered', process.env.NODE_ENV);
      const authTokenId = req.headers.authorization;
      if (!authTokenId) {
        throw new HttpException(
          'Authorization header required',
          HttpStatus.FORBIDDEN,
        );
      }
      const authToken = await AuthToken.getWithUser(
        authTokenId,
        this.dependencies,
      );
      if (!authToken) {
        throw new HttpException('Not found', HttpStatus.FORBIDDEN);
      }
      // if (authToken.isInactive()) {
      //   throw new HttpException('inactive', HttpStatus.FORBIDDEN);
      //   // res.status(403).send('inactive');
      // }
      req.requestingAuthToken = authToken;
      req.requestingUser = authToken.user;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
