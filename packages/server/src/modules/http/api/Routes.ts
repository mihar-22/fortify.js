import { Endpoint } from './Endpoint';
import { Route } from './Route';
import { signInRoute } from './auth/signIn';
import { signOutRoute } from './auth/signOut';
import { signUpRoute } from './auth/signUp';
import { resetPasswordRoute } from './auth/resetPassword';
import { csrfRoute } from './auth/csrf';
import { meRoute } from './auth/me';
import { verifyEmailRoute } from './auth/verifyEmail';
import { oauth2RedirectRoute } from './oauth2/oauth2Redirect';
import { oauth2CallbackRoute } from './oauth2/oauth2Callback';

export const Routes: Record<Endpoint, Route> = {
  [Endpoint.SignIn]: signInRoute,
  [Endpoint.SignOut]: signOutRoute,
  [Endpoint.SignUp]: signUpRoute,
  [Endpoint.ResetPassword]: resetPasswordRoute,
  [Endpoint.Csrf]: csrfRoute,
  [Endpoint.Me]: meRoute,
  [Endpoint.VerifyEmail]: verifyEmailRoute,
  [Endpoint.OAuth2Redirect]: oauth2RedirectRoute,
  [Endpoint.OAuth2Callback]: oauth2CallbackRoute,
};
