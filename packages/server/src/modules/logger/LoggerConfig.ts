import { LogDriver, LogLevel } from './Logger';
import { WinstonConfig, PinoConfig } from './drivers';

export interface LoggerConfig {
  level?: LogLevel
  prettify?: boolean
  driver?: LogDriver
  useDefaultTransporter?: boolean
  // @see https://github.com/pinojs/pino/blob/master/docs/api.md#options-object
  [LogDriver.Pino]?: PinoConfig
  // @see https://github.com/winstonjs/winston
  [LogDriver.Winston]?: WinstonConfig
}
