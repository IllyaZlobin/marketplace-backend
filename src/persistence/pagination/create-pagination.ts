/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Pagination } from '~/persistence/pagination/pagination';
import { IPaginationMeta, ObjectLiteral } from '~/persistence/pagination/types';

export function createPaginationObject<T, CustomMetaType extends ObjectLiteral = IPaginationMeta>({
  items,
  totalItems,
  currentPage,
  limit,

  metaTransformer
}: {
  items: T[];
  totalItems: number;
  currentPage: number;
  limit: number;
  metaTransformer?: (meta: IPaginationMeta) => CustomMetaType;
}): Pagination<T, CustomMetaType> {
  const totalPages = Math.ceil(totalItems / limit);
  const meta: IPaginationMeta = {
    totalItems,
    itemCount: items.length,
    itemsPerPage: limit,
    totalPages,
    currentPage: currentPage
  };
  if (metaTransformer) return new Pagination<T, CustomMetaType>(items, metaTransformer(meta));
  // @ts-ignore
  return new Pagination<T, CustomMetaType>(items, meta);
}
