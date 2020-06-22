import { Route } from '../Route';
import { HttpMethod } from '../../request/Request';

export interface SignOutReqBody {}

export interface SignOutResBody {}

export const signOutRoute: Route<SignOutReqBody, SignOutResBody> = {
  path: '/signOut',
  method: HttpMethod.POST,
  handler: async (req, res) => {},
};
