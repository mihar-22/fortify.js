import { inject, injectable } from 'inversify';
import { Dispatcher, RemoveListenerCallback } from './Dispatcher';
import { Event, EventCallback, EventCode } from './Event';
import { DIToken } from '../../DIToken';
import { Logger } from '../logger/Logger';

@injectable()
export class EventDispatcher implements Dispatcher {
  private readonly listeners: Record<EventCode, EventCallback<any>[]> = {};

  private globalListeners: EventCallback<any>[] = [];

  private queue: Record<EventCode, Event<any>[] | undefined> = {};

  private readonly logger: Logger;

  constructor(@inject(DIToken.Logger) logger: Logger) {
    this.logger = logger;
  }

  private log(event: Event<any>): void {
    this.logger[event.logLevel]({
      label: event.code,
      message: event.description,
      data: event.payload,
    });
  }

  public dispatch<PayloadType>(event: Event<PayloadType>): void {
    // eslint-disable-next-line no-param-reassign
    event.firedAt = new Date();
    this.log(event);
    this.listeners[event.code]?.forEach((cb) => { cb(event); });
    this.globalListeners.forEach((cb) => { cb(event); });
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

  public listenToAll(cb: EventCallback<any>): RemoveListenerCallback {
    this.globalListeners.push(cb);
    return () => {
      this.globalListeners = this.globalListeners.filter((callback) => callback !== cb);
    };
  }

  public push<PayloadType>(event: Event<PayloadType>): void {
    if (!this.queue[event.code]) { this.queue[event.code] = []; }
    // eslint-disable-next-line no-param-reassign
    event.queuedAt = new Date();
    this.queue[event.code]!.push(event);
  }
}
