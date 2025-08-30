import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { Params } from 'nestjs-pino';

import { AppEnvironment, DebugLevel } from '~/common/config';
import { IConfig } from '~/common/config/types';

@Injectable()
export class LoggerOptionService {
  private readonly env: AppEnvironment;

  private readonly debugEnable: boolean;
  private readonly debugLevel: DebugLevel;
  private readonly debugPrettier: boolean;

  constructor(private readonly configService: ConfigService<IConfig, true>) {
    this.env = this.configService.get('app.env', { infer: true });

    this.debugEnable = this.configService.get('debug.debugEnable', { infer: true });
    this.debugLevel = this.configService.get('debug.debugLevel', { infer: true });
    this.debugPrettier = this.configService.get('debug.debugPrettierEnable', { infer: true });
  }

  createOptions(): Params {
    const transports: any[] = [];

    if (this.debugPrettier) {
      transports.push({
        target: 'pino-pretty',
        options: {
          colorize: true,
          levelFirst: true,
          translateTime: 'SYS:standard'
        }
      });
    }

    console.log('this.debugPrettier', this.debugPrettier);

    return {
      pinoHttp: {
        level: this.debugEnable ? this.debugLevel : 'silent',
        formatters: {
          log: (object) => {
            const today = new Date();
            const formatted: { [key: string]: any } = {
              ...object,
              timestamp: today.valueOf(),
              iso: DateTime.fromJSDate(today).toISO(),
              labels: {
                env: this.env
              }
            };
            return formatted;
          }
        },
        messageKey: 'msg',
        timestamp: false,
        base: null,
        serializers: {
          req: (request) => {
            const rawReq = Object.getOwnPropertySymbols(request).find(
              (sym) => String(sym) === 'Symbol(pino-raw-req-ref)'
            );

            let body = {};
            if (rawReq) {
              body = request[rawReq].body;
            }

            return {
              id: request.id,
              method: request.method,
              url: request.url,
              path: request.path,
              route: request.route?.path,
              parameters: request.params,
              query: request.query,
              //headers: request.headers,
              body: body,
              ip: request.ip,
              referer: request.headers.referer,
              remoteAddress: request.remoteAddress,
              remotePort: request.remotePort
            };
          },
          res: (response) => ({
            statusCode: response.statusCode
            //headers: response.getHeaders(),
          }),
          err: (error: Error) => ({
            type: error.name,
            message: error.message,
            code: (error as any).statusCode,
            stack: error.stack
          })
        },
        transport:
          transports.length > 0
            ? {
                targets: transports
              }
            : undefined
        //autoLogging: true
      }
    };
  }
}
