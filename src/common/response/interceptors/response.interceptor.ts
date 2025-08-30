import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResponseDto, ResponseMetadataDto } from '~/common/response/dto/response.dto';
import { IResponse } from '~/common/response/types';

@Injectable()
export class ResponseInterceptor implements NestInterceptor<Promise<ResponseDto>> {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Promise<ResponseDto>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(async (res: Promise<any>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp();
          const response: Response = ctx.getResponse();
          const request: Request = ctx.getRequest<Request>();
          let httpStatus: HttpStatus = response.statusCode;
          let statusCode: number = response.statusCode;
          let data: Record<string, any> = {};
          const today = DateTime.now();
          const xPath = request.path;
          const xTimestamp = today.toMillis();
          let metadata: ResponseMetadataDto = {
            timestamp: xTimestamp,
            path: xPath
          };
          const responseData = (await res) as IResponse<any>;
          if (responseData) {
            const { _metadata } = responseData;
            data = responseData.data;
            httpStatus = _metadata?.customProperty?.httpStatus ?? httpStatus;
            statusCode = _metadata?.customProperty?.statusCode ?? statusCode;
            delete _metadata?.customProperty;
            metadata = {
              ...metadata,
              ..._metadata
            };
          }
          response.setHeader('x-timestamp', xTimestamp);
          response.setHeader('x-path', xPath);
          response.status(httpStatus);
          return {
            statusCode,
            _metadata: metadata,
            data
          };
        })
      );
    }
    return next.handle();
  }
}
