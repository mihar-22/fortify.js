import kleur from 'kleur';
import dayjs from 'dayjs';

export enum LogDriver {
  Pino = 'pino',
  Winston = 'winston'
}

export enum LogLevel {
  Silent = 'silent',
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace'
}

export interface Log {
  label?: string
  message: string
  data?: object
}

export interface Logger {
  level: LogLevel
  silent: (log?: Log) => void
  fatal: (log: Log) => void
  error: (log: Log) => void
  warn: (log: Log) => void
  info: (log: Log) => void
  debug: (log: Log) => void
  trace: (log: Log) => void
  addDefaultTransporter?: () => void
}

export type LogDriverFactory = (driver: LogDriver) => Logger;

export interface LoggerConstructor<ConfigType> {
  new(level: LogLevel, config?: ConfigType, prettify?: boolean): Logger
}

export const NumericLogLevel: Record<number, string> = {
  10: 'trace',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal',
};

export const LogColor: Record<LogLevel, string> = {
  [LogLevel.Silent]: 'white',
  [LogLevel.Fatal]: 'red',
  [LogLevel.Error]: 'red',
  [LogLevel.Warn]: 'yellow',
  [LogLevel.Info]: 'cyan',
  [LogLevel.Debug]: 'magenta',
  [LogLevel.Trace]: 'grey',
};

export const formatLog = (
  level: LogLevel,
  message: string,
  label?: string,
  data?: object,
  verbose?: boolean,
): string => {
  // @ts-ignore
  let levelF = `${kleur[LogColor[level]](level.toUpperCase())}`;
  if (level === LogLevel.Fatal) { levelF = kleur.bold(levelF); }
  const timestampF = kleur.yellow(dayjs().format('HH:mm:ss.SSS'));
  const labelF = label ? ` [${kleur.bold(label.toUpperCase())}]` : '';
  const dataF = (verbose && data && Object.keys(data).length > 0)
    ? `\n\n${JSON.stringify(data, null, 2)}\n\n`
    : '\n';
  return `${timestampF}${labelF} ${levelF}: ${message}${dataF}`;
};
