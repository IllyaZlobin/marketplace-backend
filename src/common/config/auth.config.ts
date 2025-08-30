import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  saltLength: number;
}

export const authConfigSchema = {};

export const authConfig = registerAs('auth', () => ({
  saltLength: 10
}));
