import { inject, injectable } from 'inversify';
import { RouteHandler, RouteHandlerFactory } from './RouteHandler';
import { AdapterFactory } from '../framework/Adapter';
import { DIToken } from '../../../DIToken';
import { RouteHandle } from './RouteHandle';

@injectable()
export class Router<
  RouteHandlerType extends RouteHandle
> implements RouteHandler<RouteHandlerType> {
  private readonly adapterFactory: AdapterFactory;

  private readonly routeHandlerFactory: RouteHandlerFactory;

  constructor(
  @inject(DIToken.HttpAdapterFactory) adapterFactory: AdapterFactory,
    @inject(DIToken.HttpRouteHandlerFactory) routeHandlerFactory: RouteHandlerFactory,
  ) {
    this.adapterFactory = adapterFactory;
    this.routeHandlerFactory = routeHandlerFactory;
  }

  // @TODO: complete router.
  public async handler(...args: Parameters<any>) {
    const adapter = this.adapterFactory(...args);

    const url = adapter.url();

    // ----
    // Figure out how to handle routing + setup middleware.
    // ----

    // resolve endpoint.
    // if no match -> throw RouteError.InvalidRoute

    // use route handler factory to create route.

    // call route.handler(...args)
  }
}
