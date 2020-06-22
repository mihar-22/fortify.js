import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';
import { buildHttpClient, HttpClient } from './HttpClient';
import { DIToken } from '../../DIToken';
import { buildFakeHttpClient } from './FakeHttpClient';
import { HttpConfig } from './HttpConfig';
import { Endpoint } from './api/Endpoint';
import { Routes } from './api/Routes';
import { buildRequestHandler } from './request/buildRequestHandler';
import { RequestHandler } from './request/RequestHandler';
import { FakeCookieJar } from './cookies/FakeCookieJar';
import { CookieJar } from './cookies/CookieJar';

export const HttpModule: ModuleProvider<HttpConfig> = {
  module: Module.Http,

  defaults: () => ({
    rateLimiter: new RateLimiterMemory({
      keyPrefix: 'fortify',
      points: 100, // 100 requests
      duration: 60, // per 60s by IP
    }),
  }),

  register: (app: App) => {
    app
      .bind<HttpClient>(DIToken.HttpClient)
      .toDynamicValue(buildHttpClient)
      .inSingletonScope();

    app
      .bind<CookieJar>(DIToken.CookieJar)
      .to(CookieJar)
      .inTransientScope();

    // Bind each individual route.
    Object.values(Endpoint).forEach((endpoint) => {
      app
        .bind<RequestHandler>(DIToken.HttpRequestHandler(endpoint))
        .toDynamicValue(() => {
          const route = Routes[endpoint];
          return buildRequestHandler(app, [route]);
        })
        .inSingletonScope();
    });

    app
      .bind<RequestHandler>(DIToken.HttpRequestHandler('*'))
      .toDynamicValue(() => {
        const allRoutes = Object.values(Routes);
        return buildRequestHandler(app, allRoutes);
      })
      .inSingletonScope();

    // @TODO: Bind middleware.
  },

  registerTestingEnv: (app: App) => {
    app.bind(DIToken.FakeCookieJar).toConstantValue(new FakeCookieJar());
    app.rebind(DIToken.CookieJar).toConstantValue(app.get(DIToken.FakeCookieJar));
    app.bind<HttpClient>(DIToken.FakeHttpClient).toConstantValue(buildFakeHttpClient());
    app.rebind<HttpClient>(DIToken.HttpClient).toConstantValue(app.get(DIToken.FakeHttpClient));
  },
};
