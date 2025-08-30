import { Module } from '@nestjs/common';

import { CategoryModule } from '~/api/admin/category/category.module';

@Module({ imports: [CategoryModule] })
export class AdminModule {}
