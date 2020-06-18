import { NextApiRequest, NextApiResponse } from 'next';
import {
  Cookies, Headers, Adapter, Query, RequestMethod, RequestUrl, Response,
} from '../Adapter';
import { HttpMethod } from '../../HttpMethod';

export type NextjsRouteHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export class Nextjs implements Adapter {
  private req: NextApiRequest;

  private res: NextApiResponse;

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.req = req;
    this.res = res;
  }

  public url(): RequestUrl {
    return this.req.url;
  }

  public method(): RequestMethod {
    return this.req.method?.toLowerCase() as HttpMethod;
  }

  public body(): object {
    try {
      // If body is invalid it will throw.
      return this.req.body;
    } catch (e) {
      return {};
    }
  }

  public cookies(): Cookies {
    return this.req.cookies;
  }

  public query(): Query {
    return this.req.query;
  }

  public headers(): Headers {
    return this.req.headers;
  }

  public setHeader(name: string, value: string | string[]): void {
    this.res.setHeader(name, value);
  }

  public setCookie(cookie: string | string[]): void {
    this.res.setHeader('Set-Cookie', cookie);
  }

  public setJsonResponse(response: Response): any {
    this.res.status(response.statusCode).json(response);
  }
}
