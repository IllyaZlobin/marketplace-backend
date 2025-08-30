import { Module } from '@nestjs/common';

import { ApiModule } from '~/api/api.module';
import { AppModule } from '~/app/app.module';
import { CommonModule } from '~/common/common.module';

@Module({ imports: [CommonModule, ApiModule, AppModule] })
export class MainModule {}
