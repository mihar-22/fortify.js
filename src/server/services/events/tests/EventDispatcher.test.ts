import EventDispatcher from '../EventDispatcher';

describe('Events', () => {
  describe('EventDispatcher', () => {
    test('basic event listening works', () => {
      const e = new EventDispatcher();
      let calls = 0;
      const expectedPayload = 1;
      const receivedPayloads: number[] = [];
      e.listen('event', (payload) => {
        calls += 1;
        receivedPayloads.push(payload);
      });
      e.listen('event', (payload) => {
        calls += 1;
        receivedPayloads.push(payload);
      });
      e.dispatch('event', expectedPayload);
      e.dispatch('another event');
      expect(receivedPayloads).toEqual([expectedPayload, expectedPayload]);
      expect(calls).toBe(2);
    });

    test('event queue works', () => {
      const e = new EventDispatcher();
      let calls = 0;
      const expectedPayload = 1;
      const receivedPayloads: number[] = [];
      e.push('event', expectedPayload);
      e.push('event', expectedPayload);
      e.push('event', expectedPayload);
      e.listen('event', (payload) => {
        calls += 1;
        receivedPayloads.push(payload);
      });
      expect(calls).toBe(0);
      expect(receivedPayloads.length).toBe(0);
      e.flush('event');
      expect(calls).toBe(3);
      expect(receivedPayloads).toEqual([expectedPayload, expectedPayload, expectedPayload]);
    });

    test('forgetting pushed events clears queue', () => {
      const e = new EventDispatcher();
      let calls = 0;
      const expectedPayload = 1;
      const receivedPayloads: number[] = [];
      e.push('event', expectedPayload);
      e.push('event', expectedPayload);
      e.push('event', expectedPayload);
      e.listen('event', (payload) => {
        calls += 1;
        receivedPayloads.push(payload);
      });
      e.forgetPushed();
      e.flush('event');
      expect(calls).toBe(0);
      expect(receivedPayloads.length).toBe(0);
    });
  });
});
