import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Next,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('here is an exception to be thrown ....................');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();
    console.log(message);
    response.status(status).json({
      error: {
        status,
        message:
          typeof message === 'object'
            ? (message['message'] as string)
            : message,
        path: request.url,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
