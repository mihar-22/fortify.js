import { Route } from '../Route';
import { HttpMethod } from '../../request/Request';

export interface SignInReqBody {}

export interface SignInResBody {}

export const signInRoute: Route<SignInReqBody, SignInResBody> = {
  path: '/signIn',
  method: HttpMethod.POST,
  handler: (req, res) => {},
};
