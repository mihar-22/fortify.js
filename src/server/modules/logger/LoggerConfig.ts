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
