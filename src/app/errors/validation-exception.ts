import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { AppErrorStatusCode } from '~/app/errors/constants';

export class ValidationException extends Error {
  readonly httpStatus: HttpStatus = HttpStatus.BAD_REQUEST;
  readonly statusCode: number = AppErrorStatusCode.VALIDATION.code;
  readonly errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('There are validation errors');

    this.errors = errors;
  }
}
