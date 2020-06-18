import { HttpAdapter } from '../../adapters/HttpAdapter';

export default (adapter: HttpAdapter) => {
  // POST -> /signIn/:provider
  // extract credentials from route
  // validate
  // call signIn on auth manager
  // call onSignIn event
  // return response
};
