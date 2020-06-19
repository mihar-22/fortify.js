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
import { isObject } from '../../../utils';

const proxyaddr = require('proxy-addr');

const writeJsonResponse = (res: ServerResponse, statusCode: number, body?: object) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body ?? {}));
};

const runConnectMiddleware = <ResultType>(
  req: IncomingMessage,
  res: ServerResponse,
  fn: (req: any, res: any, cb: (result: ResultType) => void) => void,
): Promise<ResultType> => new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) { return reject(result); }
      return resolve(result);
    });
  });

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

    if (!requestHandler) {
      writeJsonResponse(
        res,
        404,
        new HttpError(
          'INVALID_ROUTE',
          'No handler wants to take your request :(.',
          Module.Http,
          404,
        ).toResponse(),
      );

      return;
    }

    if (httpConfig?.cors) { await runConnectMiddleware(req, res, cors(httpConfig.cors)); }

    const ip = proxyaddr(req, trustedProxies);

    try {
      // @TODO: implement unique rate limiting per route.
      const limiterRes = await httpConfig!.rateLimiter!.consume(ip!);
      res.setHeader('Retry-After', limiterRes.msBeforeNext / 1000);
      res.setHeader('X-RateLimit-Limit', 100);
      res.setHeader('X-RateLimit-Remaining', limiterRes.remainingPoints);
      res.setHeader('X-RateLimit-Reset', dayjs().add(limiterRes.msBeforeNext, 'ms').toString());
    } catch (e) {
      writeJsonResponse(
        res,
        429,
        new HttpError(
          'TOO_MANY_REQUESTS',
          'Too many requests in a short period.',
          Module.Http,
          429,
        ).toResponse(),
      );

      return;
    }

    const fortifyReq = req as FortifyRequest;
    fortifyReq.ip = ip;
    fortifyReq.app = app;
    fortifyReq.params = route.params;

    // bodyparser + cookieparser + parse query

    // These might have already been parsed by the serverless provider.
    fortifyReq.body = isObject((req as any).body) ? (req as any).body : {};
    fortifyReq.cookies = isObject((req as any).cookies) ? (req as any).cookies : {};
    fortifyReq.query = isObject((req as any).query) ? (req as any).query : {};

    const fortifyRes = res as FortifyResponse;
    // status(code) -> return this
    // json (response: any)

    dispatcher.dispatch(new Event(
      HttpEvent.HttpRequest,
      `${ip} --> ${req.method} --> ${path}`,
      {
        ip,
        params: fortifyReq.params,
        cookies: fortifyReq.cookies,
        query: fortifyReq.query,
        body: fortifyReq.body,
      },
      LogLevel.Debug,
    ));

    try {
      await requestHandler(fortifyReq, fortifyRes);
    } catch (e) {
      if (e instanceof HttpError) {
        dispatcher.dispatch(new Event(
          HttpEvent.HttpError,
          `${ip} --> ${req.method} --> ${path}: ${e.message}`,
          e.toLog(),
          LogLevel.Debug,
        ));
        writeJsonResponse(res, e.statusCode, e.toResponse());
        return;
      }

      dispatcher.dispatch(new Event(
        HttpEvent.RequestHandlerFailed,
        e.message,
        e,
        LogLevel.Error,
      ));

      // If not in production forward error to the dev.
      if (!app.isProductionEnv) { throw e; }
    }
  };
};
