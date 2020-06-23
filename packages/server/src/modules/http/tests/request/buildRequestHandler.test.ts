import request from 'supertest';
import { App } from '../../../../App';
import { bootstrap } from '../../../../bootstrap';
import { HttpModule } from '../../HttpModule';
import { LoggerModule } from '../../../logger/LoggerModule';
import { EventsModule } from '../../../events/EventsModule';
import { Config, Env } from '../../../../Config';
import { FakeDispatcher } from '../../../events/FakeDispatcher';
import { DIToken } from '../../../../DIToken';
import { buildRequestHandler } from '../../request/buildRequestHandler';
import { FortifyRequest, FortifyResponse, HttpMethod } from '../../request/Request';
import { HttpEvent } from '../../HttpEvent';
import { FortifyRequestHandler } from '../../request/RequestHandler';

describe('Http', () => {
  describe('buildRequestHandler', () => {
    let app: App;
    let dispatcher: FakeDispatcher;

    const boot = (config?: Config) => {
      app = bootstrap(
        [LoggerModule, EventsModule, HttpModule],
        (config ?? { env: Env.Testing }),
        true,
      );

      dispatcher = app.get(DIToken.FakeDispatcher);
    };

    const buildRoute = (path: string, method: HttpMethod) => ({
      path,
      method,
      handler: jest.fn(),
    });

    beforeEach(() => boot());

    test('should return invalid route', async () => {
      const route = buildRoute('/testPath', HttpMethod.GET);

      await request(buildRequestHandler(app, [route]))
        .get('/')
        .expect(404)
        .then((res) => {
          expect(res.body.code).toEqual('INVALID_ROUTE');
        });

      expect(route.handler).not.toHaveBeenCalled();
      expect(dispatcher.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ code: HttpEvent.Error }),
      );
    });

    test('should return response', async () => {
      const route = buildRoute('/testPath', HttpMethod.GET);

      const handler: FortifyRequestHandler = async (req, res) => {
        res.status(201);
        res.json({ apples: 1 });
      };

      route.handler.mockImplementationOnce(handler);

      await request(buildRequestHandler(app, [route]))
        .get('/testPath')
        .expect(201)
        .then((res) => {
          expect(res.body).toEqual({ apples: 1 });
        });
    });

    test('should match multiple routes', async () => {
      const routeA = buildRoute('/pathA', HttpMethod.GET);
      const routeB = buildRoute('/pathB', HttpMethod.GET);
      const routes = [routeA, routeB];
      const handler = buildRequestHandler(app, routes);

      await request(handler)
        .get('/pathA')
        .expect(200);

      await request(handler)
        .get('/pathB')
        .expect(200);
    });

    test('should parse request body', async () => {
      const route = buildRoute('/testPath', HttpMethod.POST);

      const reqBody = {
        name: 'John',
        email: 'john_doe@gmail.com',
        isVerified: true,
      };

      let parsedReqBody;
      const handler: FortifyRequestHandler = async (req) => {
        parsedReqBody = req.body;
      };

      route.handler.mockImplementationOnce(handler);

      await request(buildRequestHandler(app, [route]))
        .post('/testPath')
        .send(reqBody)
        .expect(200);

      expect(parsedReqBody).toEqual(reqBody);
    });

    test('should parse form url encoded body', async () => {
      const route = buildRoute('/testPath', HttpMethod.POST);

      const reqBody = 'c1=v1&c2=v2';

      let parsedReqBody;
      const handler: FortifyRequestHandler = async (req) => {
        parsedReqBody = req.body;
      };

      route.handler.mockImplementationOnce(handler);

      await request(buildRequestHandler(app, [route]))
        .post('/testPath')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(reqBody)
        .expect(200);

      expect(parsedReqBody).toEqual({ c1: 'v1', c2: 'v2' });
    });

    test('should parse cookies', async () => {
      const route = buildRoute('/testPath', HttpMethod.GET);

      const cookies = 'c1=v1;HttpOnly;Secure;c2=v2';

      let parsedCookies;
      const handler: FortifyRequestHandler = async (req) => {
        parsedCookies = req.cookies;
      };

      route.handler.mockImplementationOnce(handler);

      await request(buildRequestHandler(app, [route]))
        .get('/testPath')
        .set('Cookie', cookies)
        .expect(200);

      expect(parsedCookies).toEqual({ c1: 'v1', c2: 'v2' });
    });

    test('should parse query', async () => {
      const route = buildRoute('/testPath', HttpMethod.GET);

      let parsedQuery;
      const handler: FortifyRequestHandler = async (req) => {
        parsedQuery = req.query;
      };

      route.handler.mockImplementationOnce(handler);

      await request(buildRequestHandler(app, [route]))
        .get('/testPath?c1=v1&c1=v2&c2=v3')
        .expect(200);

      expect(parsedQuery).toEqual({ c1: ['v1', 'v2'], c2: 'v3' });
    });

    test('should parse params', async () => {
      const route = buildRoute('/testPath/:opt1/:opt2', HttpMethod.GET);

      let parsedParams;
      const handler: FortifyRequestHandler = async (req) => {
        parsedParams = req.params;
      };

      route.handler.mockImplementationOnce(handler);

      await request(buildRequestHandler(app, [route]))
        .get('/testPath/apples/moreApples')
        .expect(200);

      expect(parsedParams).toEqual({ opt1: 'apples', opt2: 'moreApples' });
    });

    test('should throw too many requests', async () => {
      const route = buildRoute('/testPath', HttpMethod.GET);

      await Promise.all(Array.from(Array(100).keys())
        .map(() => request(buildRequestHandler(app, [route]))
          .get('/testPath')
          .expect(200)));

      await request(buildRequestHandler(app, [route]))
        .get('/testPath')
        .expect(429)
        .then((res) => {
          expect(res.body.code).toEqual('TOO_MANY_REQUESTS');
        });
    });

    test('should dispatch http request/response events', async () => {
      const route = buildRoute('/testPath', HttpMethod.GET);

      await request(buildRequestHandler(app, [route])).get('/testPath');

      expect(dispatcher.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ code: HttpEvent.Request }),
      );

      expect(dispatcher.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ code: HttpEvent.Response }),
      );
    });

    test('should bind req and res to request container', async () => {
      const route = buildRoute('/testPath', HttpMethod.GET);
      const receivedRequests: FortifyRequest[] = [];
      const receivedResponses: FortifyResponse[] = [];

      const handler: FortifyRequestHandler = async (req) => {
        receivedRequests.push(req.app.get(DIToken.HttpRequest));
        receivedResponses.push(req.app.get(DIToken.HttpResponse));
      };

      route.handler.mockImplementation(handler);

      await Promise.all([
        request(buildRequestHandler(app, [route])).get('/testPath'),
        request(buildRequestHandler(app, [route])).get('/testPath'),
      ]);

      expect(receivedRequests).toHaveLength(2);
      expect(receivedResponses).toHaveLength(2);
      expect(receivedRequests.every((req) => !!req)).toBeTruthy();
      expect(receivedResponses.every((res) => !!res)).toBeTruthy();
      expect(receivedRequests[0]).not.toEqual(receivedRequests[1]);
      expect(receivedResponses[0]).not.toEqual(receivedResponses[1]);
    });

    test('should throw invalid json', async () => {
      const route = buildRoute('/testPath', HttpMethod.POST);

      await request(buildRequestHandler(app, [route]))
        .post('/testPath')
        .set('Content-Type', 'application/json')
        .send('x%239')
        .expect(400)
        .then((res) => {
          expect(res.body.code).toEqual('INVALID_JSON');
        });
    });
  });
});
