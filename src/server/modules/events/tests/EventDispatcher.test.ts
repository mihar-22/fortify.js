import { Dispatcher } from '../Dispatcher';
import { DIToken } from '../../../DIToken';
import { Config, Env } from '../../../Config';
import { FakeDispatcher } from '../FakeDispatcher';
import { Event } from '../Event';
import { Logger, LogLevel } from '../../logger/Logger';
import { App } from '../../../App';
import { bootstrap } from '../../../bootstrap';
import { LoggerModule } from '../../logger/LoggerModule';
import { EventDispatcher } from '../EventDispatcher';
import { EventsModule } from '../EventsModule';

describe('Events', () => {
  describe('EventDispatcher', () => {
    let app: App;
    let logger: Logger;
    let dispatcher: Dispatcher;
    let receivedEvents: Event<number>[] = [];
    const expectedEvent = new Event('EVENT_CODE', 'Description', 1);
    const getDispatcher = () => app.get<Dispatcher>(DIToken.EventDispatcher);
    const resolveDispatcher = () => app.resolve<Dispatcher>(EventDispatcher);

    const boot = async (config?: Config) => {
      app = await bootstrap([LoggerModule, EventsModule], config, true);
      logger = app.get<Logger>(DIToken.Logger);
      dispatcher = resolveDispatcher();
    };

    beforeEach(async () => {
      receivedEvents = [];
      await boot({ env: Env.Testing });
    });

    test('dispatcher is singleton scoped', async () => {
      await boot();
      const dispatcherA = getDispatcher();
      const dispatcherB = getDispatcher();
      expect(dispatcherA).toBe(dispatcherB);
    });

    test('fake dispatcher is resolved in testing env', async () => {
      const fakeDispatcher = getDispatcher();
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
