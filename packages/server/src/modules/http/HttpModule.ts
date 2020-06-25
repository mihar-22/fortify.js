import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App, BindingScope } from '../../App';
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

export class HttpModule implements ModuleProvider<HttpConfig> {
  public static id = Module.Http;

  public static defaults() {
    return {
      rateLimiter: new RateLimiterMemory({
        keyPrefix: 'fortify',
        points: 100, // 100 requests
        duration: 60, // per 60s by IP
      }),
    };
  }

  constructor(
    private readonly app: App,
    private readonly config: HttpConfig,
  ) {}

  public register() {
    this.app.bindBuilder<() => HttpClient>(DIToken.HttpClient, buildHttpClient);

    this.app.bindClass<CookieJar>(DIToken.CookieJar, CookieJar, BindingScope.ContainerScoped);

    // Bind each individual route.
    Object.values(Endpoint).forEach((endpoint) => {
      this.app
        .bindBuilder<() => RequestHandler>(DIToken.HttpRequestHandler(endpoint), () => {
        const route = Routes[endpoint];
        return buildRequestHandler(this.app, [route]);
      });
    });

    this.app.bindBuilder<() => RequestHandler>(DIToken.HttpRequestHandler('*'), () => {
      const allRoutes = Object.values(Routes);
      return buildRequestHandler(this.app, allRoutes);
    });

    // @TODO: Bind middleware.
  }

  public registerTestingEnv() {
    this.app.bindValue(DIToken.FakeCookieJar, new FakeCookieJar());
    this.app.bindValue(DIToken.CookieJar, this.app.get(DIToken.FakeCookieJar));
    this.app.bindValue<HttpClient>(DIToken.FakeHttpClient, buildFakeHttpClient());
    this.app.bindValue<HttpClient>(DIToken.HttpClient, this.app.get(DIToken.FakeHttpClient));
  }
}
