import CookieBuilder from 'cookie';
import { injectable } from 'inversify';
import dayjs from 'dayjs';
import { Cookie, CookieParams } from './Cookie';

@injectable()
export class CookieJar {
  private queued: Record<string, Cookie> = {};

  // eslint-disable-next-line class-methods-use-this
  public make(params: CookieParams & { minutes?: number }): Cookie {
    const expires = params.expires ?? (
      params.minutes
        ? dayjs().add(params.minutes, 'minute').toDate()
        : undefined
    );

    return new Cookie({
      ...params,
      // Secure cookies by default.
      expires,
      path: params.path ?? '/',
      secure: params.secure ?? true,
      prefix: params.prefix ?? '__Host-',
      sameSite: params.sameSite ?? 'strict',
      httpOnly: params.httpOnly ?? true,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public parse(cookie: string): Cookie {
    const params: any = CookieBuilder.parse(cookie);
    return new Cookie(params);
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

  public serialize(): string[] {
    return Object.values(this.queued).map((cookie) => cookie.serialize());
  }
}
