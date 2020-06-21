import { IncomingMessage, ServerResponse } from 'http';
import Trouter from 'Trouter';
import cors from 'cors';
import dayjs from 'dayjs';
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
import {
  parseBody,
  parseCookies,
  parseQuery,
  runConnectMiddleware,
  sendJsonResponse, setLazyProp,
} from './requestUtils';

const proxyaddr = require('proxy-addr');

export const buildRequestHandler = (
  app: App,
  routes: Route[],
): RequestHandler => {
  const router = new Trouter();
  const httpConfig = app.getConfig(Module.Http);
  const dispatcher = app.get<HttpEventDispatcher>(DIToken.EventDispatcher);
  const trustedProxies = proxyaddr.compile(httpConfig?.trustedProxies ?? false);

  routes.forEach((r) => { router.add(r.method, r.path, r.handler); });

  return async (req: IncomingMessage, res: ServerResponse) => {
    const route = router.find(req.method as any, req.url!);
    const requestHandler = route.handlers?.[0];
    const { path } = routes.find((r) => r.handler === requestHandler)!;
    const ip = proxyaddr(req, trustedProxies);

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
      fortifyReq.ip = ip;
      fortifyReq.app = app;
      fortifyReq.params = route.params;
      fortifyReq.body = await parseBody(req, '1mb');
      setLazyProp(fortifyReq, 'cookies', () => parseCookies(req));
      setLazyProp(fortifyReq, 'query', () => parseQuery(req));

      const fortifyRes = res as FortifyResponse;
      fortifyRes.status = (statusCode: number) => {
        fortifyRes.statusCode = statusCode;
        return fortifyRes;
      };
      fortifyRes.json = (data: any) => sendJsonResponse(res, data);

      dispatcher.dispatch(new Event(
        HttpEvent.HttpRequest,
        `${ip} --> ${req.method} --> ${path}`,
        {
          params: fortifyReq.params,
          cookies: fortifyReq.cookies,
          query: fortifyReq.query,
          body: fortifyReq.body,
        },
        LogLevel.Info,
      ));

      await requestHandler(fortifyReq, fortifyRes);

      dispatcher.dispatch(new Event(
        HttpEvent.HttpResponse,
        `${ip} <-- ${req.method} ${res.statusCode} <-- ${path}`,
        undefined,
        LogLevel.Info,
      ));

      fortifyRes.end();
    } catch (e) {
      if (e instanceof HttpError) {
        dispatcher.dispatch(new Event(
          HttpEvent.HttpError,
          `${ip} <-- ${req.method} ${e.statusCode} <-- ${path}: ${e.message}`,
          e.toLog(),
          LogLevel.Warn,
        ));
        res.statusCode = e.statusCode;
        sendJsonResponse(res, e.toResponse());
        res.end();
        return;
      }

      dispatcher.dispatch(new Event(
        HttpEvent.RequestHandlerFailed,
        e.message,
        e,
        LogLevel.Error,
      ));

      res.end();

      // If not in production forward error to the dev.
      if (!app.isProductionEnv) { throw e; }
    }
  };
};
