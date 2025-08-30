import { Module } from '@nestjs/common';

import { ApiModule } from '~/api/api.module';
import { CommonModule } from '~/common/common.module';

@Module({ imports: [CommonModule, ApiModule] })
export class MainModule {}
