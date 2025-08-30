import { Module } from '@nestjs/common';

import { CREATE_CATEGORY_USE_CASE, CreateCategoryUseCase } from '~/app/category/use-cases/create-category.use-case';
import { UseCaseProxy } from '~/common/types/use-case';
import { CategoryModule as PersistenceCategoryModule } from '~/persistence/category/category.module';
import { CATEGORY_REPO, ICategoryRepo } from '~/persistence/category/types';

@Module({
  imports: [PersistenceCategoryModule],
  providers: [
    {
      provide: CREATE_CATEGORY_USE_CASE,
      useFactory: (categoryRepo: ICategoryRepo) => new UseCaseProxy(new CreateCategoryUseCase(categoryRepo)),
      inject: [CATEGORY_REPO]
    }
  ],
  exports: [CREATE_CATEGORY_USE_CASE]
})
export class CategoryModule {}
