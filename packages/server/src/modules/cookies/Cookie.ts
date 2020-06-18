import CookieBuilder from 'src/modules/cookies/Cookie';
import dayjs from 'dayjs';

export type CookiePrefix ='__Host-' | '__Secure-' | undefined;

export type CookieSameSite = boolean | 'lax' | 'strict' | 'none';

export type CookieParams = {
  name: string,
  value: string,
  expires?: Date,
  maxAge?: number,
  secure?: boolean,
  httpOnly?: boolean,
  prefix?: CookiePrefix,
  sameSite?: CookieSameSite,
  path?: string,
  domain?: string,
};

export class Cookie {
  public name: string;

  public value: string;

  public expires?: Date;

  public maxAge?: number;

  public path?: string;

  public httpOnly?: boolean;

  public domain?: string;

  public secure?: boolean;

  public prefix?: CookiePrefix;

  public sameSite?: CookieSameSite;

  constructor(params: CookieParams) {
    this.name = params.name;
    this.value = params.value;
    this.expires = params.expires;
    this.maxAge = params.maxAge;
    this.secure = params.secure;
    this.httpOnly = params.httpOnly;
    this.prefix = params.prefix;
    this.sameSite = params.sameSite;
    this.path = params.path ?? '/';
    this.domain = params.domain;
  }

  public isFresh(): boolean {
    return dayjs(this.expires).isAfter(dayjs().subtract(5, 'minute'));
  }

  public serialize(): string {
    return CookieBuilder.serialize(
      (this.prefix && !this.name.startsWith('__')) ? `${this.prefix}${this.name}` : this.name,
      this.value,
      {
        domain: this.domain,
        path: this.path,
        expires: this.expires,
        maxAge: this.maxAge,
        httpOnly: this.httpOnly,
        secure: this.secure,
        sameSite: this.sameSite,
      },
    );
  }
}
