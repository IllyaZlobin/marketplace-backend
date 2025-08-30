export interface IResponseMetadata {
  timestamp: number;
  path: string;
  [key: string]: any;
}

export interface IResponseOptions {
  cached?: IResponseCacheOptions | boolean;
}

export interface IResponse<T = void> {
  _metadata?: IResponseMetadata;
  data?: T;
}

export interface IResponsePagingPagination {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface IResponsePaging<T> {
  _metadata?: IResponseMetadata;
  _pagination: IResponsePagingPagination;
  data: T[];
}

export interface IResponseCacheOptions {
  key?: string;
  ttl?: number;
}
