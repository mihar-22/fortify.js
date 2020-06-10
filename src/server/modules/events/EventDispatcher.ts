import { injectable } from 'inversify';
import {
  Dispatcher, RemoveListenerCallback,
} from './Dispatcher';
import { Event, EventCallback, EventCode } from './Event';

@injectable()
export class EventDispatcher implements Dispatcher {
  private readonly listeners: Record<EventCode, EventCallback<any>[]> = {};

  private queue: Record<EventCode, Event<any>[] | undefined> = {};

  public dispatch<PayloadType>(event: Event<PayloadType>): void {
    this.listeners[event.code]?.forEach((cb) => {
      // eslint-disable-next-line no-param-reassign
      event.firedAt = new Date();
      cb(event);
    });
  }

  public flush(eventCode: string): void {
    this.queue[eventCode]?.forEach((event) => { this.dispatch(event); });
  }

  public forgetPushed(): void {
    this.queue = {};
  }

  public listen<PayloadType>(
    eventCode: EventCode,
    cb: EventCallback<PayloadType>,
  ): RemoveListenerCallback {
    if (!this.listeners[eventCode]) { this.listeners[eventCode] = []; }
    this.listeners[eventCode]!.push(cb);
    return () => {
      this.listeners[eventCode] = this.listeners[eventCode]!.filter((callback) => callback !== cb);
    };
  }

  public push<PayloadType>(event: Event<PayloadType>): void {
    if (!this.queue[event.code]) { this.queue[event.code] = []; }
    // eslint-disable-next-line no-param-reassign
    event.queuedAt = new Date();
    this.queue[event.code]!.push(event);
  }
}
