import { Module } from '@nestjs/common';

import { AdminModule } from '~/api/admin/admin.module';
import { HealthModule } from '~/api/health/health.module';

@Module({ imports: [HealthModule, AdminModule] })
export class ApiModule {}
