import { Module } from '../Module';
import { ModuleProvider } from '../../support/ModuleProvider';
import { App } from '../../App';
import { LoggerConfig } from './LoggerConfig';
import {
  LogDriver, LogDriverFactory, Logger, LoggerConstructor, LogLevel,
} from './Logger';
import { DIToken } from '../../DIToken';
import { Pino, Winston } from './drivers';
import { FakeLogger } from './FakeLogger';
import { LoggerError } from './LoggerError';

export class LoggerModule implements ModuleProvider<LoggerConfig> {
  public static id = Module.Logger;

  public static defaults(app: App) {
    return {
      level: LogLevel.Info,
      driver: LogDriver.Pino,
      prettify: !app.isProductionEnv,
      useDefaultTransporter: !app.isProductionEnv,
    };
  }

  constructor(
    private readonly app: App,
    private readonly config: LoggerConfig,
  ) {}

  public configValidation() {
    const driver = this.config.driver!;
    const isWinstonDriver = driver === LogDriver.Winston;

    if (
      isWinstonDriver
      && !this.config.useDefaultTransporter
      && !(this.config[LogDriver.Winston]?.transports)
    ) {
      return {
        code: LoggerError.MissingTransport,
        message: `The logger [${driver}] requires a transport to be set.`,
        path: `${driver}.transports`,
        link: 'https://github.com/winstonjs/winston#transports',
      };
    }

    return undefined;
  }

  public dependencies() {
    return (this.config.driver === LogDriver.Winston) ? ['winston'] : ['pino'];
  }

  public register() {
    this.app.bindFactory<LogDriverFactory>(DIToken.LogDriverFactory, (driver: LogDriver) => {
      const drivers: Record<LogDriver, LoggerConstructor<any>> = {
        [LogDriver.Pino]: Pino,
        [LogDriver.Winston]: Winston,
      };

      return new drivers[driver](
        this.config.level!,
        this.config[driver],
        this.config.prettify,
      );
    });

    this.app.bindBuilder<() => Logger>(DIToken.Logger, () => {
      const logger = this.app.get<LogDriverFactory>(DIToken.LogDriverFactory)(this.config.driver!);
      if (this.config.useDefaultTransporter) { logger.addDefaultTransporter?.(); }
      return logger;
    });
  }

  public registerTestingEnv() {
    this.app.bindValue<Logger>(DIToken.FakeLogger, new FakeLogger());
    this.app.bindValue<Logger>(DIToken.Logger, this.app.get(DIToken.FakeLogger));
  }
}
