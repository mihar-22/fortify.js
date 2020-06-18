import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';
import { buildHttpClient, HttpClient } from './HttpClient';
import { DIToken } from '../../DIToken';
import { buildFakeHttpClient } from './FakeHttpClient';
import { HttpConfig } from './HttpConfig';
import { Framework, FrameworkAdapter } from './framework/Framework';
import { AdapterConstructor, AdapterFactory } from './framework/Adapter';
import { RouteHandlerFactory } from './api/RouteHandler';
import { ApiEndpoint } from './api/ApiEndpoint';
import { Routes } from './api/Routes';
import { Router } from './api/Router';

export const HttpModule: ModuleProvider<HttpConfig> = {
  module: Module.Http,

  defaults: () => ({
    framework: Framework.Nextjs,
  }),

  register: (app: App) => {
    const config = app.getConfig(Module.Http);

    app.bind<HttpClient>(DIToken.HttpClient)
      .toDynamicValue(buildHttpClient)
      .inSingletonScope();

    app
      .bind<AdapterConstructor<any>>(DIToken.HttpAdapterConstructor)
      .toDynamicValue(() => FrameworkAdapter[config!.framework!])
      .inSingletonScope();

    app
      .bind<AdapterFactory>(DIToken.HttpAdapterFactory)
      .toFactory(() => (
        ...args: any[]
      ) => new (app.get<AdapterConstructor<any>>(DIToken.HttpAdapterConstructor))(...args));

    app
      .bind<RouteHandlerFactory>(DIToken.HttpRouteHandlerFactory)
      .toFactory(() => (endpoint: ApiEndpoint) => new Routes[endpoint](app.get<App>(DIToken.App)));

    app
      .bind<Router<any>>(DIToken.HttpRouter)
      .toDynamicValue(() => app.resolve(Router))
      .inSingletonScope();

    // @TODO: Bind middleware.
  },

  registerTestingEnv: (app: App) => {
    app.bind<HttpClient>(DIToken.FakeHttpClient).toConstantValue(buildFakeHttpClient());
    app.rebind<HttpClient>(DIToken.HttpClient).toConstantValue(app.get(DIToken.FakeHttpClient));
  },
};
