/* eslint-disable @typescript-eslint/no-unsafe-return */
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SHA256, enc } from 'crypto-js';

export function randomSalt(length: number): string {
  return genSaltSync(length);
}

export function bcrypt(passwordString: string, salt: string): string {
  return hashSync(passwordString, salt);
}

export function bcryptCompare(passwordString: string, passwordHashed: string): boolean {
  return compareSync(passwordString, passwordHashed);
}

export function sha256(string: string): string {
  return SHA256(string).toString(enc.Hex);
}

export function sha256Compare(hashOne: string, hashTwo: string): boolean {
  return hashOne === hashTwo;
}
