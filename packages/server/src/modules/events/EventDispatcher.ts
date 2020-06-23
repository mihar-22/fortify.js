import { injectable } from 'tsyringe';
import { Dispatcher, PayloadType, RemoveListenerCallback } from './Dispatcher';
import {
  Event, EventCallback, EventCode, EventMatcher,
} from './Event';
import { isRegExp, isString } from '../../utils';

@injectable()
export class EventDispatcher<
  EventPayloadRecordType = any
> implements Dispatcher<EventPayloadRecordType> {
  private readonly listeners: Record<
  EventCode,
  EventCallback<any, EventPayloadRecordType[any]>[]
  > = {};

  private matcherListeners: {
    matcher: EventMatcher,
    cb: EventCallback<any, EventPayloadRecordType[any]>
  }[] = [];

  private globalListeners: EventCallback<
  any,
  PayloadType<EventPayloadRecordType[any]>
  >[] = [];

  private queue: Record<
  EventCode,
  Event<any, PayloadType<EventPayloadRecordType[any]>
  >[] | undefined> = {};

  public dispatch<E extends keyof EventPayloadRecordType>(
    event: Event<E, PayloadType<EventPayloadRecordType[E]>>,
  ): void {
    // eslint-disable-next-line no-param-reassign
    event.firedAt = new Date();
    const e = (event.code as EventCode);
    this.listeners[e]?.forEach((cb) => { cb(event); });
    this.globalListeners.forEach((cb) => { cb(event); });
    this.matcherListeners.forEach(({ matcher, cb }) => {
      if (isString(matcher) && matcher === event.code) { cb(event); }
      if (isRegExp(matcher) && (matcher as RegExp).test(e)) { cb(event); }
    });
  }

  public flush<E extends keyof EventPayloadRecordType>(eventCode: E): void {
    this.queue[eventCode as EventCode]?.forEach((event) => { this.dispatch(event); });
  }

  public forgetPushed(): void {
    this.queue = {};
  }

  public listen<E extends keyof EventPayloadRecordType>(
    eventCode: E,
    cb: EventCallback<E, PayloadType<EventPayloadRecordType[E]>>,
  ): RemoveListenerCallback {
    const e = (eventCode as EventCode);
    if (!this.listeners[e]) { this.listeners[e] = []; }
    this.listeners[e]!.push(cb);
    return () => {
      this.listeners[e] = this.listeners[e]!.filter((c) => c !== cb);
    };
  }

  public listenTo<E extends keyof EventPayloadRecordType>(
    matcher: EventMatcher,
    cb: EventCallback<E, PayloadType<EventPayloadRecordType[E]>>,
  ): RemoveListenerCallback {
    const listener = { matcher, cb };
    this.matcherListeners.push(listener);
    return () => {
      this.matcherListeners = this.matcherListeners.filter((l) => l !== listener);
    };
  }

  public listenToAll<E extends keyof EventPayloadRecordType>(
    cb: EventCallback<E, PayloadType<EventPayloadRecordType[E]>>,
  ): RemoveListenerCallback {
    this.globalListeners.push(cb);
    return () => {
      this.globalListeners = this.globalListeners.filter((c) => c !== cb);
    };
  }

  public push<E extends keyof EventPayloadRecordType>(
    event: Event<E, PayloadType<PayloadType<EventPayloadRecordType[E]>>>,
  ): void {
    const e = (event.code as EventCode);
    if (!this.queue[e]) { this.queue[e] = []; }
    // eslint-disable-next-line no-param-reassign
    event.queuedAt = new Date();
    this.queue[e]!.push(event);
  }
}
