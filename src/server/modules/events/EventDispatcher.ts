import { injectable } from 'inversify';
import { Dispatcher, PayloadType, RemoveListenerCallback } from './Dispatcher';
import {
  Event, EventCallback, EventCode, EventMatcher,
} from './Event';
import { isRegExp, isString } from '../../../utils';

@injectable()
export class EventDispatcher<
  EventRecordType = any,
  E extends keyof EventRecordType = keyof EventRecordType
> implements Dispatcher<EventRecordType> {
  private readonly listeners: Record<EventCode, EventCallback<E, EventRecordType[E]>[]> = {};

  private matcherListeners: {
    matcher: EventMatcher,
    cb: EventCallback<E, EventRecordType[E]>
  }[] = [];

  private globalListeners: EventCallback<E, PayloadType<EventRecordType[E]>>[] = [];

  private queue: Record<EventCode, Event<E, PayloadType<EventRecordType[E]>>[] | undefined> = {};

  public dispatch(event: Event<E, PayloadType<EventRecordType[E]>>): void {
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

  public flush(eventCode: E): void {
    this.queue[eventCode as EventCode]?.forEach((event) => { this.dispatch(event); });
  }

  public forgetPushed(): void {
    this.queue = {};
  }

  public listen(
    eventCode: E,
    cb: EventCallback<E, PayloadType<EventRecordType[E]>>,
  ): RemoveListenerCallback {
    const e = (eventCode as EventCode);
    if (!this.listeners[e]) { this.listeners[e] = []; }
    this.listeners[e]!.push(cb);
    return () => {
      this.listeners[e] = this.listeners[e]!.filter((c) => c !== cb);
    };
  }

  public listenTo(
    matcher: EventMatcher,
    cb: EventCallback<E, PayloadType<EventRecordType[E]>>,
  ): RemoveListenerCallback {
    const listener = { matcher, cb };
    this.matcherListeners.push(listener);
    return () => {
      this.matcherListeners = this.matcherListeners.filter((l) => l !== listener);
    };
  }

  public listenToAll(
    cb: EventCallback<E, PayloadType<EventRecordType[E]>>,
  ): RemoveListenerCallback {
    this.globalListeners.push(cb);
    return () => {
      this.globalListeners = this.globalListeners.filter((c) => c !== cb);
    };
  }

  public push(
    event: Event<E, PayloadType<PayloadType<EventRecordType[E]>>>,
  ): void {
    const e = (event.code as EventCode);
    if (!this.queue[e]) { this.queue[e] = []; }
    // eslint-disable-next-line no-param-reassign
    event.queuedAt = new Date();
    this.queue[e]!.push(event);
  }
}
