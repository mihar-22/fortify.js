import { HttpMethod } from '../HttpMethod';

export type Cookies= Record<string, string>;

export type Headers = Record<string, string | string[] | undefined>;

export type Query = Record<string, string | string[] | undefined>;

export type RequestUrl = string | undefined;

export type RequestMethod = HttpMethod | undefined;

export interface Response {
  status: number
  data: object
}

export interface HttpAdapter {
  url(): RequestUrl
  body<InputType>(): InputType
  method(): RequestMethod
  query(): Query
  headers(): Headers
  cookies(): Cookies
  setCookie(cookie: string | string[]): void
  setResponse(response: Response): any
}
