import { IncomingMessage, ServerResponse } from 'http';
import { App } from '../../../App';
import { Cookies, Params, Query } from './RequestInfo';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface FortifyRequest<BodyType = any> extends IncomingMessage {
  app: App

  ip: string

  method?: HttpMethod

  cookies: Cookies;

  body?: BodyType;

  query: Query;

  params: Params;
}

export type FortifyResponse<DataType = any> = ServerResponse & {
  status: (statusCode: number) => FortifyResponse
  json: (data: DataType) => void
};
