/* eslint-disable @typescript-eslint/require-await */
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';

import { AppException, IAppException } from '~/app/errors/app-exception';
import { ResponseMetadataDto } from '~/common/response/dto/response.dto';

@Catch(AppException)
export class AppExceptionFilter implements ExceptionFilter<AppException> {
  private readonly logger = new Logger(AppExceptionFilter.name);

  async catch(exception: AppException, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    // TODO: disable logging in production
    //this.logger.error(exception);
    const statusHttp: HttpStatus = exception.httpStatus;
    const statusCode: number = exception.statusCode;
    const today = DateTime.now();
    const xTimestamp = today.toMillis();
    const metadata: ResponseMetadataDto = {
      timestamp: xTimestamp,
      path: request.path
    };
    const responseBody: IAppException = {
      statusCode,
      message: exception.message,
      _metadata: metadata
    };
    response.setHeader('x-timestamp', xTimestamp).status(statusHttp).json(responseBody);
    return;
  }
}
