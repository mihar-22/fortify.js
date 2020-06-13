import { Config } from '../../../Config';
import { LoggerModule } from '../LoggerModule';
import { DIToken } from '../../../DIToken';
import { LogDriver, Logger } from '../Logger';
import { Module } from '../../Module';
import { App } from '../../../App';
import { bootstrap } from '../../../bootstrap';
import { Pino, Winston } from '../drivers';

describe('Logger', () => {
  describe('Module', () => {
    let app: App;

    const getLogger = () => app.get<Logger>(DIToken.Logger);

    const boot = async (config?: Config) => {
      app = await bootstrap([LoggerModule], config, true);
    };

    beforeEach(() => boot());

    test('logger is singleton scoped', async () => {
      await boot();
      const loggerA = getLogger();
      const loggerB = getLogger();
      expect(loggerA).toBe(loggerB);
    });

    test('can resolve winston logger from container', async () => {
      await boot({ [Module.Logger]: { driver: LogDriver.Winston } });
      const logger = getLogger();
      expect(logger).toBeInstanceOf(Winston);
    });

    test('can resolve pino logger from container', async () => {
      await boot({ [Module.Logger]: { driver: LogDriver.Pino } });
      const logger = getLogger();
      expect(logger).toBeInstanceOf(Pino);
    });
  });
});
