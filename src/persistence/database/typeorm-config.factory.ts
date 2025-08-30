import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { AppEnvironment, DatabaseConfig } from '~/common/config';
import { IConfig } from '~/common/config/types';

@Injectable()
export class TypeOrmConfigFactory implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<IConfig, true>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { type, host, password, port, username, database }: DatabaseConfig = this.configService.get('database', {
      infer: true
    });
    return {
      type,
      host,
      port,
      username,
      password,
      database,
      synchronize: false,
      dropSchema: false,
      keepConnectionAlive: true,
      logging: this.configService.get('app.env', { infer: true }) !== AppEnvironment.PRODUCTION,
      entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}']
      /* extra: {
        max: this.configService.get('database.maxConnections', { infer: true }),
        ssl: this.configService.get('database.sslEnabled', { infer: true })
          ? {
              rejectUnauthorized: this.configService.get('database.rejectUnauthorized', { infer: true }),
              ca: this.configService.get('database.ca', { infer: true }) ?? undefined,
              key: this.configService.get('database.key', { infer: true }) ?? undefined,
              cert: this.configService.get('database.cert', { infer: true }) ?? undefined
            }
          : undefined
      } */
    } as TypeOrmModuleOptions;
  }
}
