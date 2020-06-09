import { injectable } from 'inversify';
import { Dispatcher } from './Dispatcher';

@injectable()
export class EventDispatcher implements Dispatcher {
  private listeners: Record<string, ((payload?: any) => void)[] | undefined> = {};

  private queue: Record<string, any[] | undefined> = {};

  public dispatch(event: string, payload?: any): void {
    this.listeners[event]?.forEach((cb) => { cb(payload); });
  }

  public flush(event: string): void {
    this.queue[event]?.forEach((payload) => {
      this.dispatch(event, payload);
    });
  }

  public forgetPushed(): void {
    this.queue = {};
  }

  public listen<T>(event: string, cb: (payload?: T) => void): () => void {
    if (!this.listeners[event]) { this.listeners[event] = []; }
    this.listeners[event]!.push(cb);
    return () => {
      this.listeners[event] = this.listeners[event]!.filter((callback) => callback !== cb);
    };
  }

  public push(event: string, payload?: any): void {
    if (!this.queue[event]) { this.queue[event] = []; }
    this.queue[event]!.push(payload);
  }
}
