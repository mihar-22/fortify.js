import { Dispatcher } from '../events/Dispatcher';
import { HttpError } from './HttpError';
import { Cookies, Params, Query } from './request/RequestInfo';

export enum HttpEvent {
  Request = 'HTTP_REQUEST',
  Response = 'HTTP_RESPONSE',
  // eslint-disable-next-line no-shadow
  Error = 'HTTP_ERROR',
  HandlerFailed = 'HTTP_HANDLER_FAILED'
}

export interface HttpEventPayload {
  [HttpEvent.Request]: {
    ip: string,
    path: string
    params: Params,
    cookies: Cookies,
    query: Query,
    body: any
  }
  [HttpEvent.Response]: void
  [HttpEvent.Error]: HttpError
  [HttpEvent.HandlerFailed]: Error
}

export type HttpEventDispatcher = Dispatcher<HttpEventPayload>;
