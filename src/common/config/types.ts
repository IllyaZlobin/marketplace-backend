import { ConfigType } from '@nestjs/config';

import { AppConfig } from '~/common/config/app.config';
import { DatabaseConfig } from '~/common/config/database.config';
import { DebugConfig } from '~/common/config/debug.config';

export interface IConfig {
  app: ConfigType<(...args: any) => AppConfig>;
  database: ConfigType<(...args: any) => DatabaseConfig>;
  debug: ConfigType<(...args: any) => DebugConfig>;
}
