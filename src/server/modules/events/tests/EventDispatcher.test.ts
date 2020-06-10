import { Container } from 'inversify';
import { EventsModule } from '../EventsModule';
import { Dispatcher } from '../Dispatcher';
import { DIToken } from '../../../DIToken';
import { Config, Env } from '../../../Config';
import { FakeDispatcher } from '../FakeDispatcher';
import { Event } from '../Event';

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

    test('basic event listening works', () => {
      const expectedEvent: Event<number> = { code: 'event', payload: 1 };
      const receivedEvents: Event<number>[] = [];
      dispatcher.listen<number>(expectedEvent.code, (event) => {
        receivedEvents.push(event);
      });
      dispatcher.dispatch(expectedEvent);
      dispatcher.dispatch(expectedEvent);
      expect(receivedEvents).toHaveLength(2);
      expect(receivedEvents).toEqual([expectedEvent, expectedEvent]);
      receivedEvents.forEach((event) => {
        expect(event.firedAt).toBeInstanceOf(Date);
      });
    });

    test('event queue works', () => {
      const expectedEvent: Event<number> = { code: 'event', payload: 1 };
      const receivedEvents: Event<number>[] = [];
      dispatcher.push(expectedEvent);
      dispatcher.push(expectedEvent);
      dispatcher.push(expectedEvent);
      dispatcher.listen<number>(expectedEvent.code, (event) => {
        receivedEvents.push(event);
      });
      expect(receivedEvents).toHaveLength(0);
      dispatcher.flush(expectedEvent.code);
      expect(receivedEvents).toHaveLength(3);
      expect(receivedEvents).toEqual([expectedEvent, expectedEvent, expectedEvent]);
      receivedEvents.forEach((event) => {
        expect(event.queuedAt).toBeInstanceOf(Date);
        expect(event.firedAt!.getTime()).toBeGreaterThan(event.queuedAt!.getTime());
      });
    });

    test('forgetting pushed events clears queue', () => {
      const expectedEvent: Event<number> = { code: 'event', payload: 1 };
      const receivedEvents: Event<number>[] = [];
      dispatcher.push(expectedEvent);
      dispatcher.push(expectedEvent);
      dispatcher.push(expectedEvent);
      dispatcher.listen<number>(expectedEvent.code, (payload) => {
        receivedEvents.push(payload);
      });
      dispatcher.forgetPushed();
      dispatcher.flush(expectedEvent.code);
      expect(receivedEvents).toHaveLength(0);
    });

    test('removing an event stops callback from being called', async () => {
      const expectedEvent: Event<number> = { code: 'event', payload: 1 };
      const receivedEvents: Event<number>[] = [];
      const removeListener = dispatcher.listen<number>(expectedEvent.code, (payload) => {
        receivedEvents.push(payload);
      });
      removeListener();
      dispatcher.dispatch(expectedEvent);
      dispatcher.dispatch(expectedEvent);
      expect(receivedEvents).toHaveLength(0);
    });
  });
});
