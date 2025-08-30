import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export enum DebugLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}

export interface DebugConfig {
  debugEnable: boolean;
  debugLevel: DebugLevel;
  debugPrettierEnable: boolean;
}

export const debugConfigSchema = {
  DEBUG_ENABLE: Joi.boolean().optional().default(false),
  DEBUG_LEVEL: Joi.string()
    .optional()
    .valid(...Object.values(DebugLevel))
    .default(DebugLevel.INFO),
  DEBUG_PRETTY_ENABLE: Joi.boolean().optional().default(false)
};

export const debugConfig = registerAs('debug', () => ({
  debugEnable: process.env.DEBUG_ENABLE,
  debugLevel: process.env.DEBUG_LEVEL,
  debugPrettierEnable: process.env.DEBUG_PRETTY_ENABLE
}));
