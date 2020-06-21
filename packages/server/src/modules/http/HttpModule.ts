import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';
import { buildHttpClient, HttpClient } from './HttpClient';
import { DIToken } from '../../DIToken';
import { buildFakeHttpClient } from './FakeHttpClient';
import { HttpConfig } from './HttpConfig';

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
    app.bind<HttpClient>(DIToken.HttpClient)
      .toDynamicValue(buildHttpClient)
      .inSingletonScope();

    // @TODO: Bind server (routes/router).

    // @TODO: Bind middleware.
  },

  registerTestingEnv: (app: App) => {
    app.bind<HttpClient>(DIToken.FakeHttpClient).toConstantValue(buildFakeHttpClient());
    app.rebind<HttpClient>(DIToken.HttpClient).toConstantValue(app.get(DIToken.FakeHttpClient));
  },
};
