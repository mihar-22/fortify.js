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

export const LoggerModule: ModuleProvider<LoggerConfig> = {
  module: Module.Logger,

  defaults: (app: App) => ({
    level: LogLevel.Info,
    driver: LogDriver.Pino,
    prettify: !app.isProductionEnv,
    useDefaultTransporter: !app.isProductionEnv,
  }),

  configValidation: (app: App) => {
    const loggerConfig = app.getConfig(Module.Logger);
    const driver = loggerConfig!.driver!;
    const isWinstonDriver = driver === LogDriver.Winston;

    if (
      isWinstonDriver
      && !loggerConfig?.useDefaultTransporter
      && !(loggerConfig?.[LogDriver.Winston]?.transports)
    ) {
      return {
        code: LoggerError.MissingTransport,
        message: `The logger [${driver}] requires a transport to be set.`,
        path: `${driver}.transports`,
        link: 'https://github.com/winstonjs/winston#transports',
      };
    }

    return undefined;
  },

  dependencies: (app: App) => {
    const loggerConfig = app.getConfig(Module.Logger);
    return (loggerConfig!.driver === LogDriver.Winston) ? ['winston'] : ['pino'];
  },

  register: (app: App) => {
    const loggerConfig = app.getConfig(Module.Logger);

    app
      .bind<LogDriverFactory>(DIToken.LogDriverFactory)
      .toFactory<Logger>(() => (driver: LogDriver) => {
      const drivers: Record<LogDriver, LoggerConstructor<any>> = {
        [LogDriver.Pino]: Pino,
        [LogDriver.Winston]: Winston,
      };
      return new drivers[driver](
        loggerConfig!.level!,
        loggerConfig![driver],
        loggerConfig!.prettify,
      );
    });

    app
      .bind<Logger>(DIToken.Logger)
      .toDynamicValue(() => {
        const logger = app.get<LogDriverFactory>(DIToken.LogDriverFactory)(loggerConfig!.driver!);
        if (loggerConfig!.useDefaultTransporter) { logger.addDefaultTransporter?.(); }
        return logger;
      })
      .inSingletonScope();
  },

  registerTestingEnv: (app: App) => {
    app.bind<Logger>(DIToken.FakeLogger).toConstantValue(new FakeLogger());
    app.rebind<Logger>(DIToken.Logger).toConstantValue(app.get(DIToken.FakeLogger));
  },
};
