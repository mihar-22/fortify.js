import { Route } from '../Route';
import { HttpMethod } from '../../request/Request';

export interface SignUpReqBody {}

export interface SignUpResBody {}

export const signUpRoute: Route<SignUpReqBody, SignUpResBody> = {
  path: '/signUp',
  method: HttpMethod.POST,
  handler: (req, res) => {},
};
