import { AsyncContainerModule } from 'inversify';
import { createDefaultConsoleTransport, createLogger, Logger } from './Logger';
import { DIToken } from '../../DIToken';
import { Config, Env } from '../../Config';
import { Module } from '../Module';
import { FakeLogger } from './FakeLogger';

export const LoggerModule = new AsyncContainerModule(async (bind) => {
  bind<Logger>(DIToken.FakeLogger)
    .toDynamicValue(() => new FakeLogger())
    .inSingletonScope();

  bind<Logger>(DIToken.Logger)
    .toDynamicValue(({ container }) => {
      const config = container.get<Config>(DIToken.Config);

      if (config?.env === Env.Testing) {
        return container.get(DIToken.FakeLogger);
      }

      const loggerConfig = config?.[Module.Logger];
      const logger = createLogger(loggerConfig);

      if (config?.env !== Env.Production) {
        logger.add(createDefaultConsoleTransport());
      }

      return logger;
    })
    .inSingletonScope();
});
