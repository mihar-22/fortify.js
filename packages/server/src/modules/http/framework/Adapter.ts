import { HttpMethod } from '../HttpMethod';
import { HttpError } from '../HttpError';
import { RouteHandle } from '../api/RouteHandle';

export type Cookies= Record<string, string>;

export type Headers = Record<string, string | string[] | undefined>;

export type Query = Record<string, string | string[] | undefined>;

export type RequestUrl = string | undefined;

export type RequestMethod = HttpMethod | undefined;

export interface Response {
  statusCode: number
  message?: string
  data?: object
}

export interface Adapter {
  url(): RequestUrl
  body(): object | undefined
  method(): RequestMethod
  query(): Query
  headers(): Headers
  cookies(): Cookies
  setHeader(name: string, value: string | string[]): void
  setCookie(cookie: string | string[]): void
  setJsonResponse(response: Response | HttpError): any
}

export type AdapterFactory = (...args: any[]) => Adapter;

export interface AdapterConstructor<RouteHandlerType extends RouteHandle> {
  new(...args: Parameters<RouteHandlerType>): Adapter
}
