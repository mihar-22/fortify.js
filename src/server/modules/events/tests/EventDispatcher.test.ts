import { Container } from 'inversify';
import { EventsModule } from '../EventsModule';
import { Dispatcher } from '../Dispatcher';
import { DIToken } from '../../../DIToken';
import { Config, Env } from '../../../Config';
import { FakeDispatcher } from '../FakeDispatcher';

describe('Events', () => {
  describe('EventDispatcher', () => {
    let container: Container;
    let dispatcher: Dispatcher;

    const getDispatcherFromContainer = () => container.get<Dispatcher>(DIToken.EventDispatcher);

    const loadModule = async (config?: Config) => {
      container = new Container();
      container.bind(DIToken.Config).toConstantValue(config);
      await container.loadAsync(EventsModule);
      dispatcher = getDispatcherFromContainer();
    };

    beforeEach(async () => { await loadModule(); });

    test('dispatcher is singleton scoped', () => {
      const dispatcherA = getDispatcherFromContainer();
      const dispatcherB = getDispatcherFromContainer();
      expect(dispatcherA).toBe(dispatcherB);
    });

    test('fake dispatcher is resolved in testing env', async () => {
      await loadModule({ env: Env.Testing });
      expect(dispatcher).toBeInstanceOf(FakeDispatcher);
    });

    test('basic event listening works', async () => {
      let calls = 0;
      const expectedPayload = 1;
      const receivedPayloads: any[] = [];
      dispatcher.listen('event', (payload) => {
        calls += 1;
        receivedPayloads.push(payload);
      });
      dispatcher.listen('event', (payload) => {
        calls += 1;
        receivedPayloads.push(payload);
      });
      dispatcher.dispatch('event', expectedPayload);
      dispatcher.dispatch('another event');
      expect(receivedPayloads).toEqual([expectedPayload, expectedPayload]);
      expect(calls).toBe(2);
    });

    test('event queue works', async () => {
      let calls = 0;
      const expectedPayload = 1;
      const receivedPayloads: any[] = [];
      dispatcher.push('event', expectedPayload);
      dispatcher.push('event', expectedPayload);
      dispatcher.push('event', expectedPayload);
      dispatcher.listen('event', (payload) => {
        calls += 1;
        receivedPayloads.push(payload);
      });
      expect(calls).toBe(0);
      expect(receivedPayloads.length).toBe(0);
      dispatcher.flush('event');
      expect(calls).toBe(3);
      expect(receivedPayloads).toEqual([expectedPayload, expectedPayload, expectedPayload]);
    });

    test('forgetting pushed events clears queue', async () => {
      let calls = 0;
      const expectedPayload = 1;
      const receivedPayloads: any[] = [];
      dispatcher.push('event', expectedPayload);
      dispatcher.push('event', expectedPayload);
      dispatcher.push('event', expectedPayload);
      dispatcher.listen('event', (payload) => {
        calls += 1;
        receivedPayloads.push(payload);
      });
      dispatcher.forgetPushed();
      dispatcher.flush('event');
      expect(calls).toBe(0);
      expect(receivedPayloads.length).toBe(0);
    });
  });
});
