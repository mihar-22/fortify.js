import { injectable } from 'inversify';
import { App } from '../../../App';
import { Adapter, AdapterFactory } from '../framework/Adapter';
import { DIToken } from '../../../DIToken';
import { ApiEndpoint } from './ApiEndpoint';
import { HttpMethod } from '../HttpMethod';
import { RouteHandler } from './RouteHandler';
import { HttpError } from '../../../support/errors';
import { RouteError } from './RouteError';
import { Module } from '../../Module';
import { RouteHandle } from './RouteHandle';

@injectable()
export abstract class AbstractRoute<
  RouteHandlerType extends RouteHandle
> implements RouteHandler<RouteHandlerType> {
  protected readonly app: App;

  protected abstract endpoint: ApiEndpoint;

  protected abstract method: HttpMethod;

  protected constructor(app: App) {
    this.app = app;
  }

  protected abstract async handle(adapter: Adapter): Promise<void>;

  public async handler(...args: Parameters<RouteHandlerType>) {
    const adapter = this.app.get<AdapterFactory>(DIToken.HttpAdapterFactory)(...args);

    try {
      if (adapter.method() !== this.method) {
        throw new HttpError(
          RouteError.InvalidHttpMethod,
          `Invalid HTTP method [${adapter.method()?.toUpperCase()}], `
          + `endpoint [/${this.endpoint}] expected [${this.method.toUpperCase()}].`,
          Module.Http,
          404,
        );
      }

      await this.handle(adapter);
    } catch (e) {
      if (e instanceof HttpError) {
        adapter.setJsonResponse(e);
        return;
      }

      if (!this.app.isProductionEnv) { throw e; }
    }
  }
}
