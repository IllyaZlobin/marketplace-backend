import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { applyDecorators, UseInterceptors } from '@nestjs/common';

import { ResponseInterceptor } from '~/common/response/interceptors/response.interceptor';
import { ResponsePagingInterceptor } from '~/common/response/interceptors/response.paging.interceptor';
import { IResponseOptions } from '~/common/response/types';

export function Response(options?: IResponseOptions): MethodDecorator {
  const decorators: (MethodDecorator | ClassDecorator | PropertyDecorator)[] = [UseInterceptors(ResponseInterceptor)];
  if (options?.cached) {
    decorators.push(UseInterceptors(CacheInterceptor));
    if (typeof options?.cached !== 'boolean') {
      if (options?.cached?.key) {
        decorators.push(CacheKey(options?.cached?.key));
      }
      if (options?.cached?.ttl) {
        decorators.push(CacheTTL(options?.cached?.ttl));
      }
    }
  }
  return applyDecorators(...decorators);
}

export function ResponsePaging(options?: IResponseOptions): MethodDecorator {
  const decorators: MethodDecorator[] = [UseInterceptors(ResponsePagingInterceptor)];
  if (options?.cached) {
    decorators.push(UseInterceptors(CacheInterceptor));
    if (typeof options?.cached !== 'boolean') {
      if (options?.cached?.key) {
        decorators.push(CacheKey(options?.cached?.key));
      }
      if (options?.cached?.ttl) {
        decorators.push(CacheTTL(options?.cached?.ttl));
      }
    }
  }
  return applyDecorators(...decorators);
}
