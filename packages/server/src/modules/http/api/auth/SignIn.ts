import { inject, injectable } from 'inversify';
import { AbstractRoute } from '../AbstractRoute';
import { ApiEndpoint } from '../ApiEndpoint';
import { HttpMethod } from '../../HttpMethod';
import { Adapter } from '../../framework/Adapter';
import { DIToken } from '../../../../DIToken';
import { App } from '../../../../App';

@injectable()
export class SignIn extends AbstractRoute<any> {
  protected method: HttpMethod;

  protected endpoint: ApiEndpoint;

  constructor(@inject(DIToken.App) app: App) {
    super(app);

    this.method = HttpMethod.POST;
    this.endpoint = ApiEndpoint.SignIn;
  }

  protected async handle(adapter: Adapter): Promise<void> {
    // POST -> /signIn
    // extract credentials from route
    // validate
    // call signIn on auth manager
    // call onSignIn event
    // return response
  }
}
