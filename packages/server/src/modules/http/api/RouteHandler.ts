import { App } from '../../../App';
import { ApiEndpoint } from './ApiEndpoint';
import { RouteHandle } from './RouteHandle';

export interface RouteHandler<RouteHandlerType extends RouteHandle> {
  handler(...args: Parameters<RouteHandlerType>): Promise<void>
}

export interface RouteHandlerConstructor<RouteHandlerType extends RouteHandle> {
  new(app: App): RouteHandler<RouteHandlerType>
}

export type RouteHandlerFactory = (endpoint: ApiEndpoint) => RouteHandler<any>;
