import { Container } from 'inversify';
import { DIToken } from '../../../DIToken';
import { Dispatcher } from '../Dispatcher';
import { Config, Env } from '../../../Config';
import { EventsModule } from '../EventsModule';
import { LoggerModule } from '../../logger/LoggerModule';
import { FakeDispatcher } from '../FakeDispatcher';

describe('Events', () => {
  describe('Module', () => {
    let container: Container;

    const getDispatcherFromContainer = () => container.get<Dispatcher>(DIToken.EventDispatcher);

    const loadModule = async (config?: Config) => {
      container = new Container();
      container.bind(DIToken.Config).toConstantValue(config ?? {});
      await container.loadAsync(LoggerModule, EventsModule);
    };

    beforeEach(() => loadModule());

    test('dispatcher is singleton scoped', () => {
      const dispatcherA = getDispatcherFromContainer();
      const dispatcherB = getDispatcherFromContainer();
      expect(dispatcherA).toBe(dispatcherB);
    });

    test('fake dispatcher is resolved in testing env', async () => {
      await loadModule({ env: Env.Testing });
      const dispatcher = getDispatcherFromContainer();
      expect(dispatcher).toBeInstanceOf(FakeDispatcher);
    });
  });
});
