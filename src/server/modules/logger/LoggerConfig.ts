import { LogDriver, LogLevel } from './Logger';
import { WinstonConfig, PinoConfig } from './drivers';

export interface LoggerConfig {
  level?: LogLevel
  prettify?: boolean
  driver?: LogDriver
  useDefaultTransporter?: boolean
  [LogDriver.Pino]?: PinoConfig
  [LogDriver.Winston]?: WinstonConfig
}

export enum LoggerConfigErrorCode {
  MissingTransport = 'MISSING_TRANSPORT'
}

export const LoggerConfigError = {
  [LoggerConfigErrorCode.MissingTransport]: (driver: LogDriver, transportConfigPath: string) => ({
    code: LoggerConfigErrorCode.MissingTransport,
    message: `The logger [${driver}] requires a transport to be set.`,
    path: `${driver}.${transportConfigPath}`,
    link: 'https://github.com/winstonjs/winston#transports',
  }),
};
