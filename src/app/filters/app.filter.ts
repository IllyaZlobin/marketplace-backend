/* eslint-disable @typescript-eslint/require-await */
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';

import { AppException, IAppException } from '~/app/errors/app-exception';
import { AppErrorStatusCode } from '~/app/errors/constants';
import { ResponseMetadataDto } from '~/common/response/dto/response.dto';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  async catch(exception, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    // TODO: disable logging in production
    //this.logger.error(exception);
    let statusHttp: HttpStatus = exception.httpStatus ?? HttpStatus.INTERNAL_SERVER_ERROR;
    let statusCode: number = exception.statusCode ?? AppErrorStatusCode.INTERNAL_SERVER_ERROR.code;
    let message: string =
      exception.message && exception.message !== ''
        ? exception.message
        : AppErrorStatusCode.INTERNAL_SERVER_ERROR.message;
    const today = DateTime.now();
    const xTimestamp = today.toMillis();
    const metadata: ResponseMetadataDto = {
      timestamp: xTimestamp,
      path: request.path
    };
    if (exception instanceof AppException) {
      statusHttp = exception.httpStatus;
      statusCode = exception.statusCode;
      message = exception.message;
    }
    const responseBody: IAppException = {
      statusCode,
      message: message,
      _metadata: metadata
    };
    response.setHeader('x-timestamp', xTimestamp).status(statusHttp).json(responseBody);
    return;
  }
}
