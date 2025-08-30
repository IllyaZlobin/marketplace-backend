import { HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import { Logger } from 'nestjs-pino';

import { ValidationException } from '~/app/errors/validation-exception';
import { AppExceptionFilter } from '~/app/filters/app.filter';
import { IConfig } from '~/common/config/types';
import { MainModule } from '~/main.module';
import { setupSwagger } from '~/setup-swagger';

import { ValidationExceptionFilter } from './app/filters/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const configService = app.get(ConfigService<IConfig, true>);

  const appConfig = configService.get('app', { infer: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      skipUndefinedProperties: false,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: (errors: ValidationError[]) => new ValidationException(errors)
    })
  );

  app.useGlobalFilters(new AppExceptionFilter(), new ValidationExceptionFilter());

  app.useLogger(app.get(Logger));

  app.use(compression());

  app.enableCors();
  app.enableShutdownHooks();

  const logger = app.get(Logger);

  setupSwagger(app, logger);

  await app.listen(appConfig.port);
  logger.log(`Application is running on port: ${appConfig.port}`);
}
bootstrap();
