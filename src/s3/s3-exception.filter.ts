// s3-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class S3ExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception.message.includes('NoSuchBucket')) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Bucket does not exist';
    } else if (exception.message.includes('Access Denied')) {
      status = HttpStatus.FORBIDDEN;
      message = 'Access denied to S3 storage';
    } else if (exception.message.includes('Network')) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'S3 storage unavailable';
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
