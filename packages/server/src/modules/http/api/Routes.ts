import { ApiEndpoint } from './ApiEndpoint';
import { RouteHandlerConstructor } from './RouteHandler';
import { SignIn } from './auth/SignIn';
import { SignOut } from './auth/SignOut';
import { SignUp } from './auth/SignUp';
import { ResetPassword } from './auth/ResetPassword';
import { Csrf } from './auth/Csrf';
import { Me } from './auth/Me';
import { VerifyEmail } from './auth/VerifyEmail';
import { OAuth2Redirect } from './oauth2/OAuth2Redirect';
import { OAuth2Callback } from './oauth2/OAuth2Callback';

export const Routes: Record<ApiEndpoint, RouteHandlerConstructor<any>> = {
  [ApiEndpoint.SignIn]: SignIn,
  [ApiEndpoint.SignOut]: SignOut,
  [ApiEndpoint.SignUp]: SignUp,
  [ApiEndpoint.ResetPassword]: ResetPassword,
  [ApiEndpoint.Csrf]: Csrf,
  [ApiEndpoint.Me]: Me,
  [ApiEndpoint.VerifyEmail]: VerifyEmail,
  [ApiEndpoint.OAuth2Redirect]: OAuth2Redirect,
  [ApiEndpoint.OAuth2Callback]: OAuth2Callback,
};
