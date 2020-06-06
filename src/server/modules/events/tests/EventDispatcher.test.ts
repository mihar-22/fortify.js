import { Container } from 'inversify';
import EventsModule from '../EventsModule';
import Dispatcher from '../Dispatcher';
import DIToken from '../../../DIToken';

const buildDispatcher = async () => {
  const container = new Container();
  await container.loadAsync(EventsModule);
  return container.get<Dispatcher>(DIToken.EventDispatcher);
};

describe('Events', () => {
  describe('EventDispatcher', () => {
    test('basic event listening works', async () => {
      const dispatcher = await buildDispatcher();
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
      const dispatcher = await buildDispatcher();
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
      const dispatcher = await buildDispatcher();
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
