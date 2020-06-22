import { Route } from '../Route';
import { HttpMethod } from '../../request/Request';

export interface OAuth2RedirectReqBody {}

export interface OAuth2RedirectResBody {}

export const oauth2RedirectRoute: Route<OAuth2RedirectReqBody, OAuth2RedirectResBody> = {
  path: '/oauth2/redirect/:provider',
  method: HttpMethod.GET,
  handler: async (req, res) => {},
};
