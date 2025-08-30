import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { DataSource, DataSourceOptions } from 'typeorm';

import { LoggerOptionModule } from '~/common//logger/logger.option.module';
import { ConfigModule } from '~/common/config/config.module';
import { LoggerOptionService } from '~/common/logger/logger.option.service';
import { TypeOrmConfigFactory } from '~/persistence/database/typeorm-config.factory';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigFactory,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      }
    }),
    LoggerModule.forRootAsync({
      imports: [LoggerOptionModule],
      inject: [LoggerOptionService],
      useFactory: (loggerOptionService: LoggerOptionService) => {
        return loggerOptionService.createOptions();
      }
    })
  ]
})
export class CommonModule {}
