import { IPaginationMeta, ObjectLiteral } from '~/persistence/pagination/types';

export class Pagination<PaginationObject, T extends ObjectLiteral = IPaginationMeta> {
  constructor(
    public items: PaginationObject[],
    public meta: T
  ) {}
}
