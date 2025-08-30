/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResponsePagingDto, ResponsePagingMetadataDto } from '~/common/response//dto/response.paging.dto';
import { IResponsePaging } from '~/common/response/types';

@Injectable()
export class ResponsePagingInterceptor implements NestInterceptor<Promise<ResponsePagingDto>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Promise<ResponsePagingDto>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(async (res: Promise<IResponsePaging<any>>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp();
          const response: Response = ctx.getResponse();
          const request: Request = ctx.getRequest<Request>();
          const httpStatus: HttpStatus = response.statusCode;
          const statusCode: number = response.statusCode;
          let data: Record<string, any>[] = [];
          const xPath = request.path;
          const xTimestamp = DateTime.now().toMillis();
          let metadata: ResponsePagingMetadataDto = {
            timestamp: xTimestamp,
            path: xPath
          };
          const responseData = await res;
          if (!responseData) {
            throw new Error('ResponsePaging must instanceof IResponsePaging');
          } else if (!responseData.data || !Array.isArray(responseData.data)) {
            throw new Error('Field data must in array and can not be empty');
          }
          data = responseData.data;
          metadata = {
            ...metadata,
            pagination: {
              ...responseData._pagination
            }
          };
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
