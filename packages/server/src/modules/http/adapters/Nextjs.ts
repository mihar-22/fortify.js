import { NextApiRequest, NextApiResponse } from 'next';
import {
  Cookies, Headers, HttpAdapter, Query, RequestMethod, RequestUrl, Response,
} from './HttpAdapter';
import { HttpMethod } from '../HttpMethod';

export type NextjsRouteHandler = (req: NextApiRequest, res: NextApiResponse) => void;

export class Nextjs implements HttpAdapter {
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

  public body<InputType>(): InputType {
    return this.req.body;
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

  public setCookie(cookie: string | string[]): void {
    this.res.setHeader('Set-Cookie', cookie);
  }

  public setResponse(response: Response): any {
    this.res.status(response.status).json(response.data);
  }
}
