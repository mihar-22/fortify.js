import { Dispatcher } from '../events/Dispatcher';
import { HttpError } from './HttpError';
import { Cookies, Params, Query } from './request/Request';

export enum HttpEvent {
  HttpRequest = 'HTTP_REQUEST',
  HttpResponse = 'HTTP_RESPONSE',
  // eslint-disable-next-line no-shadow
  HttpError = 'HTTP_ERROR',
  RequestHandlerFailed = 'REQUEST_HANDLER_FAILED'
}

export interface HttpEventPayload {
  [HttpEvent.HttpRequest]: {
    params: Params,
    cookies: Cookies,
    query: Query,
    body: any
  }
  [HttpEvent.HttpResponse]: void
  [HttpEvent.HttpError]: HttpError
  [HttpEvent.RequestHandlerFailed]: Error
}

export type HttpEventDispatcher = Dispatcher<HttpEventPayload>;
