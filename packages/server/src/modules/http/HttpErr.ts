/**
 * `Error -> Err` to not conflict with `HttpError` instance. Alias imports not working for some
 * reason.
 */
export enum HttpErr {
  InvalidRoute = 'INVALID_ROUTE',
  TooManyRequests = 'TOO_MANY_REQ',
  InvalidRequestJson = 'INVALID_JSON',
  InvalidRequestBody = 'INVALID_REQ_BODY',
  RequestBodyTooLarge = 'REQ_BODY_TOO_LARGE',
  InternalServerError = 'INTERNAL_SERVER_ERROR'
}
