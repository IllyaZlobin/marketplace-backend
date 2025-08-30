import { ConfigType } from '@nestjs/config';

import { AppConfig } from '~/common/config/app.config';
import { AuthConfig } from '~/common/config/auth.config';
import { DatabaseConfig } from '~/common/config/database.config';
import { DebugConfig } from '~/common/config/debug.config';

export interface IConfig {
  app: ConfigType<(...args: any) => AppConfig>;
  auth: ConfigType<(...args: any) => AuthConfig>;
  database: ConfigType<(...args: any) => DatabaseConfig>;
  debug: ConfigType<(...args: any) => DebugConfig>;
}
