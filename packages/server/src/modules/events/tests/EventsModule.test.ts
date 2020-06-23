import { DIToken } from '../../../DIToken';
import { Dispatcher } from '../Dispatcher';
import { Config, Env } from '../../../Config';
import { FakeDispatcher } from '../FakeDispatcher';
import { App } from '../../../App';
import { bootstrap } from '../../../bootstrap';
import { EventDispatcher } from '../EventDispatcher';
import { coreModules } from '../../index';

describe('Events', () => {
  describe('Module', () => {
    let app: App;

    const getDispatcher = () => app.get<Dispatcher>(DIToken.EventDispatcher);

    const boot = (config?: Config) => {
      app = bootstrap(coreModules, config, true);
    };

    beforeEach(() => boot());

    test('dispatcher is singleton scoped', () => {
      const dispatcherA = getDispatcher();
      const dispatcherB = getDispatcher();
      expect(dispatcherA).toBe(dispatcherB);
      expect(dispatcherA).toBeInstanceOf(EventDispatcher);
    });

    test('fake dispatcher is resolved in testing env', async () => {
      boot({ env: Env.Testing });
      const dispatcher = getDispatcher();
      expect(dispatcher).toBeInstanceOf(FakeDispatcher);
    });
  });
});
