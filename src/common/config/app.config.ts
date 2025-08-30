import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export enum AppEnvironment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

export const APP_ENVIRONMENTS: AppEnvironment[] = [
  AppEnvironment.LOCAL,
  AppEnvironment.DEVELOPMENT,
  AppEnvironment.STAGING,
  AppEnvironment.PRODUCTION
] as const;

export interface AppConfig {
  port: number;
  env: AppEnvironment;
  globalPrefix: string;
}

export const appConfigSchema = {
  APP_PORT: Joi.number().port().required(),
  APP_ENV: Joi.string()
    .valid(...APP_ENVIRONMENTS)
    .required(),
  APP_GLOBAL_PREFIX: Joi.string().optional().default('/api')
};

export const app = registerAs('app', () => ({
  port: process.env.APP_PORT,
  env: process.env.APP_ENV,
  globalPrefix: process.env.APP_GLOBAL_PREFIX || '/api'
}));
