import { Dispatcher } from '../events/Dispatcher';
import { HttpError } from './HttpError';
import { Cookies, Params, Query } from './request/Request';

export enum HttpEvent {
  HttpRequest = 'HTTP_REQUEST',
  // eslint-disable-next-line no-shadow
  HttpError = 'HTTP_ERROR',
  RequestHandlerFailed = 'REQUEST_HANDLER_FAILED'
}

export interface HttpEventPayload {
  [HttpEvent.HttpRequest]: { ip?: string, params: Params, cookies: Cookies, query: Query, body: any }
  [HttpEvent.HttpError]: HttpError
  [HttpEvent.RequestHandlerFailed]: Error
}

export type HttpEventDispatcher = Dispatcher<HttpEventPayload>;
