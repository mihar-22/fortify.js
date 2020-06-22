import { Route } from '../Route';
import { HttpMethod } from '../../request/Request';

export interface MeReqBody {}

export interface MeResBody {}

export const meRoute: Route<MeReqBody, MeResBody> = {
  path: '/me',
  method: HttpMethod.GET,
  handler: (req, res) => {},
};
