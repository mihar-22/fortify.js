import { inject, injectable } from 'inversify';
import { AbstractRoute } from '../AbstractRoute';
import { ApiEndpoint } from '../ApiEndpoint';
import { HttpMethod } from '../../HttpMethod';
import { Adapter } from '../../framework/Adapter';
import { DIToken } from '../../../../DIToken';
import { App } from '../../../../App';

@injectable()
export class Csrf extends AbstractRoute<any> {
  protected method: HttpMethod;

  protected endpoint: ApiEndpoint;

  constructor(@inject(DIToken.App) app: App) {
    super(app);

    this.method = HttpMethod.GET;
    this.endpoint = ApiEndpoint.Csrf;
  }

  protected async handle(adapter: Adapter): Promise<void> {
    // ...
  }
}
