import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error: any = exception.getResponse();

    switch (status) {
      case 400:
        response.status(status).json({
          code: status,
          error: error.message as string,
          message: error.error as string,
          details: [],
        });
        break;
      default:
        response.status(status).json({
          code: status,
          error: error.message as string,
          message: error.error as string,
        });
    }
  }
}
