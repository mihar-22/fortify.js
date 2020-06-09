import winston, { LeveledLogMethod, LoggerOptions, LogMethod } from 'winston';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Transport from 'winston-transport';

const { format } = winston;

export interface Logger {
  silent: boolean
  transports: Transport[]

  // for cli and npm levels
  error: LeveledLogMethod;
  warn: LeveledLogMethod;
  help: LeveledLogMethod;
  data: LeveledLogMethod;
  info: LeveledLogMethod;
  debug: LeveledLogMethod;
  prompt: LeveledLogMethod;
  http: LeveledLogMethod;
  verbose: LeveledLogMethod;
  input: LeveledLogMethod;
  silly: LeveledLogMethod;

  // for syslog levels only
  emerg: LeveledLogMethod;
  alert: LeveledLogMethod;
  crit: LeveledLogMethod;
  warning: LeveledLogMethod;
  notice: LeveledLogMethod;

  log: LogMethod;
  add(transport: Transport): Logger;
  remove(transport: Transport): Logger;
  clear(): Logger;
  close(): Logger;
}

export type LoggerConfig = LoggerOptions;

export const createLogger = (logger?: LoggerConfig): Logger => winston.createLogger(logger);

export const createDefaultConsoleTransport = () => new winston.transports.Console({
  format: winston.format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS' }),
    format.printf((info: any) => `[${info.timestamp}] [${info.message.module}] ${info.level}: `
      + `${info.message.action}`
      + `${info.message.context ? `\n\n${JSON.stringify(info.message.context, null, 2)}` : ''}`),
  ),
});
