import { Route } from '../Route';
import { HttpMethod } from '../../request/Request';

export interface OAuth2CallbackReqBody {}

export interface OAuth2CallbackResBody {}

export const oauth2CallbackRoute: Route<OAuth2CallbackReqBody, OAuth2CallbackResBody> = {
  path: '/oauth2/callback/:provider',
  method: HttpMethod.GET,
  handler: (req, res) => {},
};
