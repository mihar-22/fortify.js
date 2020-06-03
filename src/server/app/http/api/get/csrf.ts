import { Request } from '../../../../services/routing/Request';
import { Response } from '../../../../services/routing/Response';

export default (req: Request, res: Response) => {
  // GET -> /csrf

  // call createCsrfToken on auth manager
  // return response cookie
};
