import { Repository, FindManyOptions, SelectQueryBuilder, ObjectLiteral, FindOptionsWhere } from 'typeorm';

import { nonNull } from '~/common/utils/nonNull';
import { createPaginationObject } from '~/persistence/pagination/create-pagination';
import { Pagination } from '~/persistence/pagination/pagination';
import { IPaginationMeta, IPaginationOptions, PaginationType, TypeORMCacheType } from '~/persistence/pagination/types';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export async function paginate<T extends ObjectLiteral, CustomMetaType extends ObjectLiteral = IPaginationMeta>(
  repository: Repository<T>,
  options: IPaginationOptions<CustomMetaType>,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>
): Promise<Pagination<T, CustomMetaType>>;
export async function paginate<T extends ObjectLiteral, CustomMetaType extends ObjectLiteral = IPaginationMeta>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>
): Promise<Pagination<T, CustomMetaType>>;

export async function paginate<T extends ObjectLiteral, CustomMetaType extends ObjectLiteral = IPaginationMeta>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>
) {
  return repositoryOrQueryBuilder instanceof Repository
    ? paginateRepository<T, CustomMetaType>(repositoryOrQueryBuilder, options, searchOptions)
    : paginateQueryBuilder<T, CustomMetaType>(repositoryOrQueryBuilder, options);
}

export async function paginateRaw<T extends ObjectLiteral, CustomMetaType extends ObjectLiteral = IPaginationMeta>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>
): Promise<Pagination<T, CustomMetaType>> {
  const { page, limit, paginationType, cacheQueries } = resolveOptions(options);
  const promises: [Promise<T[]>, Promise<number>] = [
    (paginationType === PaginationType.LIMIT_AND_OFFSET
      ? queryBuilder.limit(limit).offset((page - 1) * limit)
      : queryBuilder.take(limit).skip((page - 1) * limit)
    )
      .cache(cacheQueries)
      .getRawMany<T>(),
    countQuery(queryBuilder, cacheQueries)
  ];
  const [items, total] = await Promise.all(promises);
  return createPaginationObject<T, CustomMetaType>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
    metaTransformer: options.metaTransformer
  });
}

export async function paginateRawAndEntities<
  T extends ObjectLiteral,
  CustomMetaType extends ObjectLiteral = IPaginationMeta
>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>
): Promise<[Pagination<T, CustomMetaType>, Partial<T>[]]> {
  const { page, limit, paginationType, cacheQueries } = resolveOptions(options);
  const promises: [Promise<{ entities: T[]; raw: T[] }>, Promise<number>] = [
    (paginationType === PaginationType.LIMIT_AND_OFFSET
      ? queryBuilder.limit(limit).offset((page - 1) * limit)
      : queryBuilder.take(limit).skip((page - 1) * limit)
    )
      .cache(cacheQueries)
      .getRawAndEntities<T>(),
    countQuery(queryBuilder, cacheQueries)
  ];
  const [itemObject, total] = await Promise.all(promises);
  return [
    createPaginationObject<T, CustomMetaType>({
      items: itemObject.entities,
      totalItems: total,
      currentPage: page,
      limit,
      metaTransformer: options.metaTransformer
    }),
    itemObject.raw
  ];
}

function resolveOptions(options: IPaginationOptions<any>): {
  page: number;
  limit: number;
  paginationType: PaginationType;
  cacheQueries: TypeORMCacheType;
} {
  const page = resolveNumericOption(options, 'page', DEFAULT_PAGE);
  const limit = resolveNumericOption(options, 'limit', DEFAULT_LIMIT);
  const paginationType = options.paginationType || PaginationType.LIMIT_AND_OFFSET;
  const cacheQueries = options.cacheQueries || false;
  return { page, limit, paginationType, cacheQueries };
}

function resolveNumericOption(options: IPaginationOptions<any>, key: 'page' | 'limit', defaultValue: number): number {
  const value = options[key];
  const resolvedValue = Number(value);
  if (Number.isInteger(resolvedValue) && resolvedValue >= 0) return resolvedValue;
  console.warn(
    `Query parameter "${key}" with value "${value}" was resolved as "${resolvedValue}", please validate your query input! Falling back to default "${defaultValue}".`
  );
  return defaultValue;
}

async function paginateRepository<T extends ObjectLiteral, CustomMetaType extends ObjectLiteral = IPaginationMeta>(
  repository: Repository<T>,
  options: IPaginationOptions<CustomMetaType>,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>
): Promise<Pagination<T, CustomMetaType>> {
  const { page, limit } = resolveOptions(options);
  if (page < 1) {
    return createPaginationObject<T, CustomMetaType>({
      items: [],
      totalItems: 0,
      currentPage: page,
      limit,
      metaTransformer: options.metaTransformer
    });
  }
  const promises: [Promise<T[]>, Promise<number>] = [
    repository.find({
      skip: limit * (page - 1),
      take: limit,
      ...searchOptions
    }),
    repository.count({
      ...searchOptions
    })
  ];
  const [items, total] = await Promise.all(promises);
  return createPaginationObject<T, CustomMetaType>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
    metaTransformer: options.metaTransformer
  });
}

async function paginateQueryBuilder<T extends ObjectLiteral, CustomMetaType extends ObjectLiteral = IPaginationMeta>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>
): Promise<Pagination<T, CustomMetaType>> {
  const { page, limit, paginationType, cacheQueries } = resolveOptions(options);
  const promises: [Promise<T[]>, Promise<number>] = [
    (PaginationType.LIMIT_AND_OFFSET === paginationType
      ? queryBuilder.limit(limit).offset((page - 1) * limit)
      : queryBuilder.take(limit).skip((page - 1) * limit)
    )
      .cache(cacheQueries)
      .getMany(),
    countQuery(queryBuilder, cacheQueries)
  ];
  const [items, total] = await Promise.all(promises);
  return createPaginationObject<T, CustomMetaType>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
    metaTransformer: options.metaTransformer
  });
}

const countQuery = async <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  cacheOption: TypeORMCacheType
): Promise<number> => {
  const totalQueryBuilder = queryBuilder.clone();
  totalQueryBuilder.skip(undefined).limit(undefined).offset(undefined).take(undefined);
  const result = await queryBuilder.connection
    .createQueryBuilder()
    .select('COUNT(*)', 'value')
    .from(`(${totalQueryBuilder.getQuery()})`, 'uniqueTableAlias')
    .cache(cacheOption)
    .setParameters(queryBuilder.getParameters())
    .getRawOne<{ value: string }>();
  return Number(nonNull(result).value);
};
