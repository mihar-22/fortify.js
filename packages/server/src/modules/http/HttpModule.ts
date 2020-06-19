import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';
import { buildHttpClient, HttpClient } from './HttpClient';
import { DIToken } from '../../DIToken';
import { buildFakeHttpClient } from './FakeHttpClient';
import { HttpConfig } from './HttpConfig';
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
    const config = app.getConfig(Module.Http);

    app.bind<HttpClient>(DIToken.HttpClient)
      .toDynamicValue(buildHttpClient)
      .inSingletonScope();

    app
      .bind<CookieJar>(DIToken.Cookies)
      .toDynamicValue(() => app.resolve(CookieJar))
      .inRequestScope();

    // @TODO: Bind server (routes/router).

    // @TODO: Bind middleware.
  },

  registerTestingEnv: (app: App) => {
    app.bind<HttpClient>(DIToken.FakeHttpClient).toConstantValue(buildFakeHttpClient());
    app.rebind<HttpClient>(DIToken.HttpClient).toConstantValue(app.get(DIToken.FakeHttpClient));
  },
};
