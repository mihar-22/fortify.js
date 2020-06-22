import { injectable } from 'inversify';
import { ServerResponse } from 'http';
import { Cookie, CookieParams } from './Cookie';

@injectable()
export class CookieJar {
  private queued: Record<string, Cookie> = {};

  // eslint-disable-next-line class-methods-use-this
  public make(params: CookieParams & { minutes?: number }): Cookie {
    return Cookie.make(params);
  }

  public queue(newCookie: Cookie | CookieParams): void {
    const cookie = (newCookie instanceof Cookie) ? newCookie : this.make(newCookie);
    this.queued[cookie.name] = cookie;
  }

  public dequeue(name: string): void {
    delete this.queued[name];
  }

  public forget(name: string) {
    this.queued[name] = this.make({
      name,
      value: '',
      minutes: -2628000,
      maxAge: -2628000,
    });
  }

  public getQueued(name: string): Cookie | undefined {
    return this.queued[name];
  }

  public hasQueued(name: string): boolean {
    return !!this.queued[name];
  }

  public attachTo(res: ServerResponse) {
    return Object.values(this.queued).forEach((cookie) => cookie.attachTo(res));
  }
}
