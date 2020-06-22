import { Route } from '../Route';
import { HttpMethod } from '../../request/Request';

export interface ResetPasswordReqBody {}

export interface ResetPasswordResBody {}

export const resetPasswordRoute: Route<ResetPasswordReqBody, ResetPasswordResBody> = {
  path: '/resetPassword',
  method: HttpMethod.POST,
  handler: async (req, res) => {},
};
