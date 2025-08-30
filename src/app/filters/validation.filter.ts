/* eslint-disable @typescript-eslint/require-await */
import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';

import { IAppException } from '~/app/errors/app-exception';
import { ValidationException } from '~/app/errors/validation-exception';
import { ResponseMetadataDto } from '~/common/response/dto/response.dto';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  async catch(exception: ValidationException, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const xTimestamp = DateTime.now().toMillis();
    const metadata: ResponseMetadataDto = {
      timestamp: xTimestamp,
      path: request.path
    };
    const message = exception.message || 'Validation failed';
    const responseBody: IAppException = {
      statusCode: exception.statusCode,
      message,
      errors: exception.errors,
      _metadata: metadata
    };
    response.setHeader('x-timestamp', xTimestamp).status(exception.httpStatus).json(responseBody);
    return;
  }
}
