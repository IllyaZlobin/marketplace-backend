import { Module } from '@nestjs/common';

import { CategoryRepoImpl } from '~/persistence/category/category.repo';
import { CATEGORY_REPO } from '~/persistence/category/types';

@Module({ providers: [{ provide: CATEGORY_REPO, useClass: CategoryRepoImpl }], exports: [CATEGORY_REPO] })
export class CategoryModule {}
