import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { IResponseMetadata } from '~/common/response/types';

export enum AppExceptionType {
  INVALID_DATA = 'invalid_data',
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  CONFLICT = 'conflict',
  INTERNAL_SERVER_ERROR = 'internal_server_error'
}

export class AppException extends Error {
  readonly httpStatus: HttpStatus;
  readonly statusCode: number;

  constructor(input: AppExceptionInput) {
    super(input.message);
    this.statusCode = input.statusCode;
    switch (input.type) {
      case AppExceptionType.INVALID_DATA: {
        this.httpStatus = HttpStatus.BAD_REQUEST;
        break;
      }
      case AppExceptionType.NOT_FOUND: {
        this.httpStatus = HttpStatus.NOT_FOUND;
        break;
      }
      case AppExceptionType.UNAUTHORIZED: {
        this.httpStatus = HttpStatus.UNAUTHORIZED;
        break;
      }
      case AppExceptionType.FORBIDDEN: {
        this.httpStatus = HttpStatus.FORBIDDEN;
        break;
      }
      case AppExceptionType.CONFLICT: {
        this.httpStatus = HttpStatus.CONFLICT;
        break;
      }
      case AppExceptionType.INTERNAL_SERVER_ERROR: {
        this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
      }
      default: {
        this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
      }
    }
  }
}

interface AppExceptionInput {
  statusCode: number;
  message: string;
  type: AppExceptionType;
}

export interface IAppException {
  statusCode: number;
  message: string;
  errors?: ValidationError[];
  data?: Record<string, any>;
  _metadata?: IResponseMetadata;
}
