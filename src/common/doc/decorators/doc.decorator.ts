import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  getSchemaPath
} from '@nestjs/swagger';

import { AppErrorStatusCode } from '~/app/errors/constants';
import {
  DocRequestBodyType,
  IDocAuthOptions,
  IDocDefaultOptions,
  IDocGuardOptions,
  IDocOfOptions,
  IDocOptions,
  IDocRequestFileOptions,
  IDocRequestOptions,
  IDocResponseFileOptions,
  IDocResponseOptions
} from '~/common/doc/types';
import { FILE_MIME } from '~/common/file/types';
import { ResponseDto } from '~/common/response/dto/response.dto';
import { ResponsePagingDto } from '~/common/response/dto/response.paging.dto';

export function DocDefault<T>(options: IDocDefaultOptions<T>): MethodDecorator {
  const docs: any[] = [];
  const schema: Record<string, any> = {
    allOf: [{ $ref: getSchemaPath(ResponseDto) }],
    properties: {
      statusCode: {
        type: 'number',
        example: options.statusCode
      }
    }
  };
  if (options.dto) {
    docs.push(ApiExtraModels(options.dto));
    schema.properties = {
      ...schema.properties,
      data: {
        $ref: getSchemaPath(options.dto as any)
      }
    };
  }
  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: options.httpStatus.toString(),
      status: options.httpStatus,
      schema
    }),
    ...docs
  );
}

export function DocOneOf(httpStatus: HttpStatus, ...documents: IDocOfOptions[]): MethodDecorator {
  const docs: any[] = [];
  const oneOf: any[] = [];
  for (const doc of documents) {
    const oneOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDto) }],
      properties: {
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK
        }
      }
    };
    if (doc.dto) {
      docs.push(ApiExtraModels(doc.dto));
      oneOfSchema.properties = {
        ...oneOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.dto)
        }
      };
    }
    oneOf.push(oneOfSchema);
  }
  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: httpStatus.toString(),
      status: httpStatus,
      schema: {
        oneOf
      }
    }),
    ...docs
  );
}

export function DocAnyOf(httpStatus: HttpStatus, ...documents: IDocOfOptions[]): MethodDecorator {
  const docs: any[] = [];
  const anyOf: any[] = [];
  for (const doc of documents) {
    const anyOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDto) }],
      properties: {
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK
        }
      }
    };
    if (doc.dto) {
      docs.push(ApiExtraModels(doc.dto));
      anyOfSchema.properties = {
        ...anyOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.dto)
        }
      };
    }
    anyOf.push(anyOfSchema);
  }
  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: httpStatus.toString(),
      status: httpStatus,
      schema: {
        anyOf
      }
    }),
    ...docs
  );
}

export function DocAllOf(httpStatus: HttpStatus, ...documents: IDocOfOptions[]): MethodDecorator {
  const docs: any[] = [];
  const allOf: any[] = [];
  for (const doc of documents) {
    const allOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDto) }],
      properties: {
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK
        }
      }
    };
    if (doc.dto) {
      docs.push(ApiExtraModels(doc.dto));
      allOfSchema.properties = {
        ...allOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.dto)
        }
      };
    }
    allOf.push(allOfSchema);
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: httpStatus.toString(),
      status: httpStatus,
      schema: {
        allOf
      }
    }),
    ...docs
  );
}

export function Doc(options?: IDocOptions): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: options?.summary,
      deprecated: options?.deprecated,
      description: options?.description,
      operationId: options?.operation
    }),
    DocDefault({
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      statusCode: AppErrorStatusCode.INTERNAL_SERVER_ERROR
    }),
    DocDefault({
      httpStatus: HttpStatus.REQUEST_TIMEOUT,
      statusCode: AppErrorStatusCode.TIMEOUT
    })
  );
}

export function DocRequest(options?: IDocRequestOptions) {
  const docs: Array<ClassDecorator | MethodDecorator> = [];
  if (options?.bodyType === DocRequestBodyType.FORM_DATA) {
    docs.push(ApiConsumes('multipart/form-data'));
  } else if (options?.bodyType === DocRequestBodyType.TEXT) {
    docs.push(ApiConsumes('text/plain'));
  } else if (options?.bodyType === DocRequestBodyType.JSON) {
    docs.push(ApiConsumes('application/json'));
  } else if (options?.bodyType === DocRequestBodyType.FORM_URLENCODED) {
    docs.push(ApiConsumes('x-www-form-urlencoded'));
  }
  if (options?.bodyType) {
    docs.push(
      DocDefault({
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        statusCode: AppErrorStatusCode.VALIDATION
      })
    );
  }
  if (options?.params) {
    const params: MethodDecorator[] = options?.params?.map((param) => ApiParam(param));
    docs.push(...params);
  }
  if (options?.queries) {
    const queries: MethodDecorator[] = options?.queries?.map((query) => ApiQuery(query));
    docs.push(...queries);
  }
  if (options?.dto) {
    docs.push(ApiBody({ type: options?.dto }));
  }
  return applyDecorators(...docs);
}

export function DocRequestFile(options?: IDocRequestFileOptions) {
  const docs: Array<ClassDecorator | MethodDecorator> = [];
  if (options?.params) {
    const params: MethodDecorator[] = options?.params.map((param) => ApiParam(param));
    docs.push(...params);
  }
  if (options?.queries) {
    const queries: MethodDecorator[] = options?.queries?.map((query) => ApiQuery(query));
    docs.push(...queries);
  }
  if (options?.dto) {
    docs.push(ApiBody({ type: options?.dto }));
  }
  return applyDecorators(ApiConsumes('multipart/form-data'), ...docs);
}

export function DocGuard(options?: IDocGuardOptions) {
  const oneOfForbidden: IDocOfOptions[] = [];
  if (options?.role) {
    oneOfForbidden.push({
      statusCode: AppErrorStatusCode.POLICY.ROLE_FORBIDDEN,
      message: `Sorry, your role doesn't grant access to this resource`
    });
  }
  if (options?.policy) {
    oneOfForbidden.push({
      statusCode: AppErrorStatusCode.POLICY.ABILITY_FORBIDDEN,
      message: `Sorry, you don't have the necessary permissions to perform this action`
    });
  }
  return applyDecorators(DocOneOf(HttpStatus.FORBIDDEN, ...oneOfForbidden));
}

export function DocAuth(options?: IDocAuthOptions) {
  const docs: Array<ClassDecorator | MethodDecorator> = [];
  const oneOfUnauthorized: IDocOfOptions[] = [];
  if (options?.jwtRefreshToken) {
    docs.push(ApiBearerAuth('refreshToken'));
    oneOfUnauthorized.push({
      message: 'The refresh token is unauthorized',
      statusCode: AppErrorStatusCode.AUTH.JWT_REFRESH_TOKEN
    });
  }
  if (options?.jwtAccessToken) {
    docs.push(ApiBearerAuth('accessToken'));
    oneOfUnauthorized.push({
      message: 'The access token is unauthorized',
      statusCode: AppErrorStatusCode.AUTH.JWT_ACCESS_TOKEN
    });
  }
  return applyDecorators(...docs, DocOneOf(HttpStatus.UNAUTHORIZED, ...oneOfUnauthorized));
}

export function DocResponse<T = void>(options?: IDocResponseOptions<T>): MethodDecorator {
  const docs: IDocDefaultOptions = {
    httpStatus: options?.httpStatus ?? HttpStatus.OK,
    statusCode: options?.statusCode ?? options?.httpStatus ?? HttpStatus.OK
  };
  if (options?.dto) {
    docs.dto = options?.dto;
  }
  return applyDecorators(ApiProduces('application/json'), DocDefault(docs));
}

export function DocErrorGroup(docs: MethodDecorator[]) {
  return applyDecorators(...docs);
}

export function DocResponsePaging<T>(message: string, options: IDocResponseOptions<T>): MethodDecorator {
  const docs: IDocDefaultOptions = {
    httpStatus: options?.httpStatus ?? HttpStatus.OK,
    message,
    statusCode: options?.statusCode ?? options?.httpStatus ?? HttpStatus.OK
  };
  if (options?.dto) {
    docs.dto = options?.dto;
  }
  return applyDecorators(
    ApiProduces('application/json'),
    ApiExtraModels(ResponsePagingDto),
    ApiExtraModels(docs.dto as any),
    ApiResponse({
      description: docs.httpStatus.toString(),
      status: docs.httpStatus,
      schema: {
        allOf: [{ $ref: getSchemaPath(ResponsePagingDto) }],
        properties: {
          message: {
            example: message
          },
          statusCode: {
            type: 'number',
            example: docs.statusCode
          },
          data: {
            type: 'array',
            items: {
              $ref: getSchemaPath(docs.dto as any)
            }
          }
        }
      }
    })
  );
}

export function DocResponseFile(options?: IDocResponseFileOptions): MethodDecorator {
  const httpStatus: HttpStatus = options?.httpStatus ?? HttpStatus.OK;
  return applyDecorators(
    ApiProduces(options?.fileType ?? FILE_MIME.CSV),
    ApiResponse({
      description: httpStatus.toString(),
      status: httpStatus
    })
  );
}
