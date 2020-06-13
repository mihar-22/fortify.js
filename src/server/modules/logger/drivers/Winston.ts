import winston, { Logger as WinstonLogger, LoggerOptions } from 'winston';
import {
  formatLog, Log, Logger, LogLevel,
} from '../Logger';

export type WinstonConfig = LoggerOptions;

export class Winston implements Logger {
  private readonly logger: WinstonLogger;

  private readonly prettify: boolean;

  constructor(level: LogLevel, config?: WinstonConfig, prettify?: boolean) {
    this.prettify = prettify ?? false;
    this.logger = winston.createLogger(config);
    this.logger.level = config?.level ?? level;
    this.logger.levels = {
      [LogLevel.Silent]: 0,
      [LogLevel.Fatal]: 1,
      [LogLevel.Error]: 2,
      [LogLevel.Warn]: 3,
      [LogLevel.Info]: 4,
      [LogLevel.Debug]: 5,
      [LogLevel.Trace]: 6,
    } as Record<LogLevel, number>;
  }

  public get level(): LogLevel {
    return this.logger.level as LogLevel;
  }

  public set level(newLevel: LogLevel) {
    this.logger.level = newLevel;
    this.logger.silent = (newLevel === LogLevel.Silent);
  }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  public silent(log?: Log): void {
  }

  public fatal(log: Log): void {
    this.logger.log(LogLevel.Fatal, '', log);
  }

  public error(log: Log): void {
    this.logger.log(LogLevel.Error, '', log);
  }

  public warn(log: Log): void {
    this.logger.log(LogLevel.Warn, '', log);
  }

  public info(log: Log): void {
    this.logger.log(LogLevel.Info, '', log);
  }

  public debug(log: Log): void {
    this.logger.log(LogLevel.Debug, '', log);
  }

  public trace(log: Log): void {
    this.logger.log(LogLevel.Trace, '', log);
  }

  public addDefaultTransporter() {
    this.logger.add(new winston.transports.Console({
      level: this.level,
      format: this.prettify
        ? winston.format.printf(({
          level, message, label, data,
        }) => formatLog(level as LogLevel, message, label, data, (this.level === LogLevel.Trace)))
        : undefined,
    }));
  }
}
