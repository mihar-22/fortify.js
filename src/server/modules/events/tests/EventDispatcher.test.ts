import { Container } from 'inversify';
import { EventsModule } from '../EventsModule';
import { Dispatcher } from '../Dispatcher';
import { DIToken } from '../../../DIToken';
import { Config, Env } from '../../../Config';
import { FakeDispatcher } from '../FakeDispatcher';
import { Event } from '../Event';
import { EventDispatcher } from '../EventDispatcher';
import { LoggerModule } from '../../logger/LoggerModule';
import { Logger, LogLevel } from '../../logger/Logger';

describe('Events', () => {
  describe('EventDispatcher', () => {
    let container: Container;
    let logger: Logger;
    let dispatcher: Dispatcher;

    const expectedEvent = new Event('EVENT_CODE', 'Description', 1);
    let receivedEvents: Event<number>[] = [];

    const getDispatcherFromContainer = () => container.get<Dispatcher>(DIToken.EventDispatcher);
    const resolveDispatcherFromContainer = () => container.resolve(EventDispatcher);

    const loadModule = async (config: Config = { env: Env.Testing }) => {
      container = new Container();
      container.bind(DIToken.Config).toConstantValue(config);
      await container.loadAsync(LoggerModule, EventsModule);
      dispatcher = resolveDispatcherFromContainer();
      logger = container.get<Logger>(DIToken.Logger);
    };

    beforeEach(async () => {
      receivedEvents = [];
      await loadModule();
    });

    test('dispatcher is singleton scoped', () => {
      const dispatcherA = getDispatcherFromContainer();
      const dispatcherB = getDispatcherFromContainer();
      expect(dispatcherA).toBe(dispatcherB);
    });

    test('fake dispatcher is resolved in testing env', async () => {
      const fakeDispatcher = getDispatcherFromContainer();
      expect(fakeDispatcher).toBeInstanceOf(FakeDispatcher);
    });

    test('events should be logged', () => {
      dispatcher.dispatch(expectedEvent);
      expect(logger.debug).toHaveBeenCalledWith({
        label: expectedEvent.code,
        message: expectedEvent.description,
        ctx: expectedEvent.payload,
      });
    });

    test('event payload should not be logged if logger level is less than debug', () => {
      logger.level = LogLevel.Verbose;
      dispatcher.dispatch(expectedEvent);
      expect(logger.debug).toHaveBeenCalledWith({
        label: expectedEvent.code,
        message: expectedEvent.description,
        ctx: {},
      });
    });

    test('basic event listening works', () => {
      dispatcher.listen<number>(expectedEvent.code, (event) => { receivedEvents.push(event); });
      dispatcher.dispatch(expectedEvent);
      dispatcher.dispatch(expectedEvent);
      expect(receivedEvents).toHaveLength(2);
      expect(receivedEvents).toEqual([expectedEvent, expectedEvent]);
      receivedEvents.forEach((event) => { expect(event.firedAt).toBeInstanceOf(Date); });
    });

    test('event queue works', () => {
      dispatcher.push(expectedEvent);
      dispatcher.push(expectedEvent);
      dispatcher.push(expectedEvent);
      dispatcher.listen<number>(expectedEvent.code, (event) => { receivedEvents.push(event); });
      expect(receivedEvents).toHaveLength(0);
      dispatcher.flush(expectedEvent.code);
      expect(receivedEvents).toHaveLength(3);
      expect(receivedEvents).toEqual([expectedEvent, expectedEvent, expectedEvent]);
      receivedEvents.forEach((event) => {
        expect(event.queuedAt).toBeInstanceOf(Date);
        expect(event.firedAt!.getTime()).toBeGreaterThanOrEqual(event.queuedAt!.getTime());
      });
    });

    test('forgetting pushed events clears queue', () => {
      dispatcher.push(expectedEvent);
      dispatcher.push(expectedEvent);
      dispatcher.push(expectedEvent);
      dispatcher.listen<number>(expectedEvent.code, (event) => { receivedEvents.push(event); });
      dispatcher.forgetPushed();
      dispatcher.flush(expectedEvent.code);
      expect(receivedEvents).toHaveLength(0);
    });

    test('removing an event stops callback from being called', () => {
      const removeListener = dispatcher.listen<number>(expectedEvent.code, (event) => {
        receivedEvents.push(event);
      });
      removeListener();
      dispatcher.dispatch(expectedEvent);
      dispatcher.dispatch(expectedEvent);
      expect(receivedEvents).toHaveLength(0);
    });

    test('can listen to all events', () => {
      const expectedEventTwo = new Event('EVENT_CODE_TWO', 'Description Two', 2);
      dispatcher.listenToAll((event) => { receivedEvents.push(event); });
      dispatcher.dispatch(expectedEvent);
      dispatcher.dispatch(expectedEventTwo);
      expect(receivedEvents).toHaveLength(2);
      expect(receivedEvents).toContain(expectedEvent);
      expect(receivedEvents).toContain(expectedEventTwo);
    });

    test('removing global event listener works', () => {
      const expectedEventTwo = new Event('EVENT_CODE_TWO', 'Description Two', 2);
      const removeListener = dispatcher.listenToAll((event) => { receivedEvents.push(event); });
      removeListener();
      dispatcher.dispatch(expectedEvent);
      dispatcher.dispatch(expectedEventTwo);
      expect(receivedEvents).toHaveLength(0);
    });
  });
});
