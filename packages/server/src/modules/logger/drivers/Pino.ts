import { Logger as PinoLogger, LoggerOptions } from 'pino';
import {
  formatLog, Log, Logger, LogLevel, NumericLogLevel,
} from '../Logger';

export type PinoConfig = LoggerOptions;

export class Pino implements Logger {
  private readonly logger: PinoLogger;

  constructor(level: LogLevel, config?: PinoConfig, prettify?: boolean) {
    const self = this;

    const prettyConfig: PinoConfig = prettify ? {
      timestamp: false,
      prettyPrint: {
        // @ts-ignore
        suppressFlushSyncWarning: true,
      },
      prettifier: () => function pretty(data: any) {
        return formatLog(
          NumericLogLevel[data.level] as any,
          data.message,
          data.label,
          data.data,
          self.level === LogLevel.Trace,
        );
      },
    } : {};

    this.logger = require('pino')({
      level,
      ...prettyConfig,
      ...config,
    });
  }

  public get level(): LogLevel {
    return this.logger.level as LogLevel;
  }

  public set level(newLevel: LogLevel) {
    this.logger.level = this.level;
  }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  public silent(log?: Log): void {}

  public fatal(log: Log): void {
    this.logger.fatal(log);
  }

  public error(log: Log): void {
    this.logger.error(log);
  }

  public warn(log: Log): void {
    this.logger.warn(log);
  }

  public info(log: Log): void {
    this.logger.info(log);
  }

  public debug(log: Log): void {
    this.logger.debug(log);
  }

  public trace(log: Log): void {
    this.logger.log(log);
  }
}
