import { Request } from '../../../../services/routing/Request';
import { Response } from '../../../../services/routing/Response';

export default (req: Request, res: Response) => {
  // POST -> /signIn/:provider
  // POST -> /signUp

  // extract credentials from route
  // validate
  // call signIn on auth manager
  // call onSignIn event
  // return response
};
