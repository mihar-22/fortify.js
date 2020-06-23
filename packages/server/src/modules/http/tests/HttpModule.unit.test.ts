import { App } from '../../../App';
import { Config, Env } from '../../../Config';
import { bootstrap } from '../../../bootstrap';
import { coreModules } from '../../index';
import { EventsModule } from '../../events/EventsModule';
import { DIToken } from '../../../DIToken';
import { FakeCookieJar } from '../cookies/FakeCookieJar';
import { HttpClient } from '../HttpClient';
import { CookieJar } from '../cookies/CookieJar';
import { Endpoint } from '../api/Endpoint';
import { RequestHandler } from '../request/RequestHandler';

describe('Http', () => {
  describe('Module', () => {
    let app: App;

    const boot = (config?: Config) => {
      app = bootstrap(coreModules, config, true, [EventsModule]);
    };

    test('should resolve fake http client in testing env', () => {
      boot({ env: Env.Testing });
      const httpClient: any = app.get(DIToken.HttpClient);
      expect(httpClient.mock).toBeDefined();
    });

    test('should resolve fake cookie jar in testing env', () => {
      boot({ env: Env.Testing });
      const cookieJar: any = app.get(DIToken.CookieJar);
      expect(cookieJar).toBeInstanceOf(FakeCookieJar);
    });

    test('http client should be singleton scoped', () => {
      boot();
      const httpClientA = app.get<HttpClient>(DIToken.HttpClient);
      const httpClientB = app.get<HttpClient>(DIToken.HttpClient);
      expect(httpClientA).toBe(httpClientB);
    });

    test('cookie jar should be container scoped', () => {
      boot();
      const cookieJarA = app.get<CookieJar>(DIToken.CookieJar);
      const cookieJarB = app.get<CookieJar>(DIToken.CookieJar);
      expect(cookieJarA).toBe(cookieJarB);
      boot();
      const cookieJarC = app.get<CookieJar>(DIToken.CookieJar);
      expect(cookieJarC).not.toBe(cookieJarA);
      expect(cookieJarC).not.toBe(cookieJarB);
    });

    test('should resolve all endpoint handlers', () => {
      boot();

      Object.values(Endpoint).forEach((endpoint) => {
        const handler = app.get<RequestHandler>(DIToken.HttpRequestHandler(endpoint));
        expect(handler).toBeDefined();
      });

      expect(app.get(DIToken.HttpRequestHandler('*'))).toBeDefined();
    });
  });
});
