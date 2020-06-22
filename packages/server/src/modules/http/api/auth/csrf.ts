import { Route } from '../Route';
import { HttpMethod } from '../../request/Request';

export interface CsrfReqBody {}

export interface CsrfResBody {}

export const csrfRoute: Route<CsrfReqBody, CsrfResBody> = {
  path: '/csrf',
  method: HttpMethod.GET,
  handler: async (req, res) => {},
};
