import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

import { app, appConfigSchema } from '~/common/config/app.config';
import { authConfig, authConfigSchema } from '~/common/config/auth.config';
import { database, databaseConfigSchema } from '~/common/config/database.config';
import { debugConfig, debugConfigSchema } from '~/common/config/debug.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env`],
      load: [app, authConfig, database, debugConfig],
      cache: true,
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        ...appConfigSchema,
        ...databaseConfigSchema,
        ...debugConfigSchema,
        ...authConfigSchema
      }),
      validationOptions: {
        abortEarly: true,
        debug: true,
        stack: true
      }
    })
  ],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
