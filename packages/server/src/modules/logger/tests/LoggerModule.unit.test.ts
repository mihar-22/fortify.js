import { Config, Env } from '../../../Config';
import { LoggerModule } from '../LoggerModule';
import { DIToken } from '../../../DIToken';
import {
  LogDriver, LogDriverFactory, Logger, LogLevel,
} from '../Logger';
import { Module } from '../../Module';
import { App } from '../../../App';
import { bootstrap } from '../../../bootstrap';
import { FakeLogger } from '../FakeLogger';
import { LoggerError } from '../LoggerError';

describe('Logger', () => {
  describe('Module', () => {
    let app: App;

    const getLogger = () => app.get<Logger>(DIToken.Logger);

    const boot = (config?: Config) => {
      app = bootstrap([LoggerModule], config, true);
      return app;
    };

    beforeEach(() => boot());

    test('logger is singleton scoped', () => {
      boot();
      const loggerA = getLogger();
      const loggerB = getLogger();
      expect(loggerA).toBe(loggerB);
    });

    test('resolves fake logger in testing env', () => {
      boot({ env: Env.Testing });
      const logger = getLogger();
      expect(logger).toBeInstanceOf(FakeLogger);
    });

    test('resolves all drivers', () => {
      Object.values(LogDriver).forEach((driver) => {
        const cApp = boot({ [Module.Logger]: { driver } });
        const logger = cApp.get<Logger>(DIToken.Logger);
        const { constructor } = cApp.get<LogDriverFactory>(DIToken.LogDriverFactory)(driver);
        expect(logger).toBeInstanceOf(constructor);
      });
    });

    test('config should be passed down to respective driver', () => {
      Object.values(LogDriver).forEach((driver) => {
        const cApp = boot({
          [Module.Logger]: {
            driver,
            [driver]: { level: LogLevel.Fatal },
          },
        });
        const logger = cApp.get<Logger>(DIToken.Logger);
        expect(logger.level).toBe(LogLevel.Fatal);
      });
    });

    test('returns correct deps for winston', () => {
      boot({ [Module.Logger]: { driver: LogDriver.Winston } });
      expect(LoggerModule.dependencies!(app)).toEqual(['winston']);
    });

    test('returns correct deps for pino', () => {
      boot({ [Module.Logger]: { driver: LogDriver.Pino } });
      expect(LoggerModule.dependencies!(app)).toEqual(['pino']);
    });

    test('should throw configuration error if winston transport is missing', () => {
      expect(() => {
        boot({
          [Module.Logger]: {
            driver: LogDriver.Winston,
            useDefaultTransporter: false,
          },
        });
      }).toThrow(LoggerError.MissingTransport);
    });
  });
});
