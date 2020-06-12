import winston, { LeveledLogMethod, LoggerOptions, LogMethod } from 'winston';
import * as Transport from 'winston-transport';
import { bold, yellow } from 'kleur';

// From the highest priority (error) to the lowest (silly).
export enum LogLevel {
  Error = 'error',
  Warn = ' warn',
  Info = 'info',
  Http = 'http',
  Verbose = 'verbose',
  Debug = 'debug',
  Silly = 'silly',
}

export interface Logger {
  level: string
  silent: boolean
  transports: Transport[]
  error: LeveledLogMethod;
  warn: LeveledLogMethod;
  info: LeveledLogMethod;
  http: LeveledLogMethod;
  verbose: LeveledLogMethod;
  debug: LeveledLogMethod;
  silly: LeveledLogMethod;
  log: LogMethod;
  add(transport: Transport): Logger;
  remove(transport: Transport): Logger;
  clear(): Logger;
  close(): Logger;
}

export type LoggerConfig = LoggerOptions;

export const createLogger = (logger?: LoggerConfig): Logger => winston.createLogger(logger);

const { format } = winston;
export const createDefaultConsoleTransport = () => new winston.transports.Console({
  format: winston.format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS' }),
    format.printf(({
      timestamp, level, label, message, ctx,
    }) => `${yellow(timestamp)} [${bold(label)}] ${level}: ${message}`
      + `${(ctx && Object.keys(ctx).length > 0) ? `\n\n${JSON.stringify(ctx, null, 2)}` : ''}`),
  ),
});
