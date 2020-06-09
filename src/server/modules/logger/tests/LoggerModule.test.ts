import { Container } from 'inversify';
import { Config, Env } from '../../../Config';
import { LoggerModule } from '../LoggerModule';
import { DIToken } from '../../../DIToken';
import { Logger } from '../Logger';
import { Module } from '../../Module';

describe('Logger', () => {
  describe('Module', () => {
    let container: Container;

    const getLoggerFromContainer = () => container.get<Logger>(DIToken.Logger);

    const loadModule = async (config?: Config) => {
      container = new Container();
      container.bind(DIToken.Config).toConstantValue(config);
      await container.loadAsync(LoggerModule);
    };

    test('logger is singleton scoped', async () => {
      await loadModule();
      const loggerA = getLoggerFromContainer();
      const loggerB = getLoggerFromContainer();
      expect(loggerA).toBe(loggerB);
    });

    test('can resolve logger from container', async () => {
      await loadModule();
      const logger = getLoggerFromContainer();
      expect(logger).toBeDefined();
      expect((logger.transports[0] as any).name).toBe('console');
    });

    test('does not use default transport in production', async () => {
      await loadModule({ env: Env.Production });
      const logger = getLoggerFromContainer();
      expect(logger).toBeDefined();
      expect(logger.transports[0]).toBeUndefined();
    });

    test('logger config is passed to constructor', async () => {
      await loadModule({
        [Module.Logger]: {
          silent: true,
        },
      });
      const logger = getLoggerFromContainer();
      expect(logger).toBeDefined();
      expect(logger.silent).toBeTruthy();
    });
  });
});
