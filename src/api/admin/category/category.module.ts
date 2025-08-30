import { Module } from '@nestjs/common';

import { CategoryController } from '~/api/admin/category/category.controller';
import { CategoryModule as AppCategoryModule } from '~/app/category/category.module';

@Module({ imports: [AppCategoryModule], controllers: [CategoryController] })
export class CategoryModule {}
