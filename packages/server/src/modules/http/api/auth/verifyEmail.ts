import { Route } from '../Route';
import { HttpMethod } from '../../request/Request';

export interface VerifyEmailReqBody {}

export interface VerifyEmailResBody {}

export const verifyEmailRoute: Route<VerifyEmailReqBody, VerifyEmailResBody> = {
  path: '/verifyEmail/:email/:token',
  method: HttpMethod.GET,
  handler: (req, res) => {},
};
