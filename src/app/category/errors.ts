import { AppException, AppExceptionType } from '~/app/errors/app-exception';
import { AppErrorStatusCode } from '~/app/errors/constants';

export class CategoryNotFoundError extends AppException {
  constructor(message?: string) {
    super({
      statusCode: AppErrorStatusCode.CATEGORY.NOT_FOUND.code,
      message: message ?? AppErrorStatusCode.CATEGORY.NOT_FOUND.message,
      type: AppExceptionType.NOT_FOUND
    });
  }
}

export class CategorySlugAlreadyExistsError extends AppException {
  constructor(message?: string) {
    super({
      statusCode: AppErrorStatusCode.CATEGORY.SLUG_EXIST.code,
      message: message ?? AppErrorStatusCode.CATEGORY.SLUG_EXIST.message,
      type: AppExceptionType.INVALID_DATA
    });
  }
}
