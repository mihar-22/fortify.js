import {
  createDefaultConsoleTransport, createLogger, Logger, LoggerConfig,
} from './Logger';
import { DIToken } from '../../DIToken';
import { Module } from '../Module';
import { FakeLogger } from './FakeLogger';
import { ModuleProvider } from '../../support/ModuleProvider';
import { App } from '../../App';

export const LoggerModule: ModuleProvider<LoggerConfig> = {
  module: Module.Logger,

  register: (app: App) => {
    const loggerConfig = app.getConfig(Module.Logger);

    app.bind<Logger>(DIToken.Logger)
      .toDynamicValue(() => {
        const logger = createLogger(loggerConfig);

        if (!app.isProductionEnv) {
          // @ts-ignore
          logger.add(createDefaultConsoleTransport());
        }

        return logger;
      })
      .inSingletonScope();
  },

  registerTestingEnv: (app: App) => {
    app.bind<Logger>(DIToken.FakeLogger).toConstantValue(new FakeLogger());
    app.rebind<Logger>(DIToken.Logger).toConstantValue(app.get(DIToken.FakeLogger));
  },
};
