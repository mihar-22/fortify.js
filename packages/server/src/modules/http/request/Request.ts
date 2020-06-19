import { IncomingMessage, ServerResponse } from 'http';
import { Cookie } from '../cookies/Cookie';
import { App } from '../../../App';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type Query = Record<string, string | string[]>;

export type Cookies = Record<string, Cookie>;

export type Params = Record<string, string>;

export interface FortifyRequest<BodyType = any> extends IncomingMessage {
  app: App

  ip: string

  method?: HttpMethod

  cookies: Cookies;

  body?: BodyType;

  query: Query;

  params: Params;
}

export type FortifyResponse<ResponseType = any> = ServerResponse & {
  status: (statusCode: number) => FortifyResponse
  json: (response: ResponseType) => void
};
