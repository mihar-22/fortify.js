import { IncomingMessage, ServerResponse } from 'http';
import Trouter from 'Trouter';
import cors from 'cors';
import dayjs from 'dayjs';
import { green, red } from 'kleur';
import { App } from '../../../App';
import { Route } from '../api/Route';
import { FortifyRequest, FortifyResponse } from './Request';
import { RequestHandler } from './RequestHandler';
import { HttpError } from '../../../support/errors';
import { Module } from '../../Module';
import { DIToken } from '../../../DIToken';
import { HttpEvent, HttpEventDispatcher } from '../HttpEvent';
import { Event } from '../../events/Event';
import { LogLevel } from '../../logger/Logger';
import { setLazyProp } from '../../../utils';
import {
  compileTrust,
  parseBody,
  parseCookies,
  parseQuery,
  runConnectMiddleware,
  sendJsonResponse,
} from './requestUtils';

const proxyaddr = require('proxy-addr');

export const buildRequestHandler = (
  app: App,
  routes: Route[],
): RequestHandler => {
  const router = new Trouter();
  const httpConfig = app.getConfig(Module.Http);
  const dispatcher = app.get<HttpEventDispatcher>(DIToken.EventDispatcher);
  const trustedProxies = compileTrust(httpConfig?.trustedProxies ?? false);

  routes.forEach((r) => { router.add(r.method, r.path, r.handler); });

  return async (req: IncomingMessage, res: ServerResponse) => {
    const ip = proxyaddr(req, trustedProxies).split(':').pop();
    const path = req.url!.match('^[^?]*')![0];
    const route = router.find(req.method as any, path);
    const requestHandler = route.handlers?.[0];

    try {
      if (httpConfig?.cors) {
        await runConnectMiddleware(req, res, cors(httpConfig.cors));
      }

      if (!requestHandler) {
        throw new HttpError(
          'INVALID_ROUTE',
          'No handler wants to take your request :(.',
          Module.Http,
          404,
        );
      }

      try {
        // @TODO: implement unique rate limiting per route.
        const limiterRes = await httpConfig!.rateLimiter!.consume(ip!);
        res.setHeader('Retry-After', limiterRes.msBeforeNext / 1000);
        res.setHeader('X-RateLimit-Limit', 100);
        res.setHeader('X-RateLimit-Remaining', limiterRes.remainingPoints);
        res.setHeader('X-RateLimit-Reset', dayjs().add(limiterRes.msBeforeNext, 'ms').toString());
      } catch (e) {
        throw new HttpError(
          'TOO_MANY_REQUESTS',
          'Too many requests in a short period.',
          Module.Http,
          429,
        );
      }

      const fortifyReq = req as FortifyRequest;
      fortifyReq.ip = ip!;
      fortifyReq.app = app.clone();
      fortifyReq.params = route.params;
      fortifyReq.body = await parseBody(req, '1mb');
      setLazyProp(fortifyReq, 'cookies', () => parseCookies(req));
      setLazyProp(fortifyReq, 'query', () => parseQuery(req));

      const fortifyRes = res as FortifyResponse;
      fortifyRes.json = (data: any) => { sendJsonResponse(res, data); };
      fortifyRes.status = (statusCode: number) => {
        fortifyRes.statusCode = statusCode;
        return fortifyRes;
      };

      dispatcher.dispatch(new Event(
        HttpEvent.Request,
        `💻 ${ip} --> ${green(`${req.method} ${path}`)}`,
        {
          ip,
          path,
          params: fortifyReq.params,
          cookies: fortifyReq.cookies,
          query: fortifyReq.query,
          body: fortifyReq.body,
        },
      ));

      // Note: This is NOT binding to the global application container, it's binding to the child
      // container that is created solely for this req/res lifecycle.
      fortifyReq.app.bind(DIToken.HttpRequest).toConstantValue(fortifyReq);
      fortifyReq.app.bind(DIToken.HttpResponse).toConstantValue(fortifyRes);

      await requestHandler(fortifyReq, fortifyRes);

      fortifyReq.app.destroy();

      dispatcher.dispatch(new Event(
        HttpEvent.Response,
        `💻 ${ip} <-- ${green(`${req.method} ${path} ${res.statusCode}`)}`,
        undefined,
      ));

      fortifyRes.end();
    } catch (e) {
      if (e instanceof HttpError) {
        dispatcher.dispatch(new Event(
          HttpEvent.Error,
          `❌ ${ip} X-- ${red(`${req.method} ${path} ${e.statusCode}`)}`,
          e.toLog(),
          LogLevel.Warn,
        ));
        res.statusCode = e.statusCode;
        sendJsonResponse(res, e.toResponse());
        res.end();
        return;
      }

      dispatcher.dispatch(new Event(
        HttpEvent.HandlerFailed,
        `❌ ${e.message}`,
        e,
        LogLevel.Error,
      ));

      // If not in production forward error to the dev.
      if (!app.isProductionEnv) {
        throw e;
      } else {
        res.end();
      }
    }
  };
};
