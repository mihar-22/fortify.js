import { IncomingMessage, ServerResponse } from 'http';
import getRawBody from 'raw-body';
import { URL } from 'url';
import qs from 'querystring';
import { HttpError } from '../../../support/errors';
import { Module } from '../../Module';
import { Cookies, FortifyRequest, Query } from './Request';
import { isArray, isObject } from '../../../utils';
import { Cookie } from '../cookies/Cookie';

const { parse } = require('content-type');

export const sendJsonResponse = (res: ServerResponse, body?: object) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.write(body ?? {});
};

export const runConnectMiddleware = <ResultType>(
  req: IncomingMessage,
  res: ServerResponse,
  fn: (req: any, res: any, cb: (result: ResultType) => void) => void,
): Promise<ResultType> => new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

export const parseJson = (str: string): object => {
  if (str.length === 0) { return {}; }

  try {
    return JSON.parse(str);
  } catch (e) {
    throw new HttpError(
      'INVALID_JSON',
      'Request body contains invalid JSON.',
      Module.Http,
      400,
    );
  }
};

export const parseBody = async (
  req: IncomingMessage,
  limit: string | number,
): Promise<object> => {
  // If a parent request handler like Next.js has done the work let's move on.
  if (isObject((req as any).body)) { return (req as any).body as object; }

  const contentType = parse(req.headers['content-type'] || 'text/plain');
  const { type, parameters } = contentType;
  const encoding = parameters.charset || 'utf-8';

  let buffer;

  try {
    buffer = await getRawBody(req, { encoding, limit });
  } catch (e) {
    if (e.type === 'entity.too.large') {
      throw new HttpError(
        'BODY_TOO_LARGE',
        `Request body exceeded limit [${limit}]`,
        Module.Http,
        413,
      );
    } else {
      throw new HttpError(
        'INVALID_BODY',
        'Request body is invalid/malformed.',
        Module.Http,
        400,
      );
    }
  }

  const body = buffer.toString();

  if (type === 'application/json' || type === 'application/ld+json') {
    return parseJson(body);
  } if (type === 'application/x-www-form-urlencoded') {
    return qs.decode(body);
  }

  return {};
};

export const parseCookies = (req: IncomingMessage): Cookies => {
  const header: any = req.headers.cookie;
  if (!header) { return {}; }
  return Cookie.parse(isArray(header) ? header.join(';') : header);
};

export const parseQuery = ({ url }: IncomingMessage): Query => {
  const query: Query = {};

  // We provide a placeholder base url because we only want searchParams.
  const params = new URL(url!, 'https://n').searchParams;

  params.forEach((value, key) => {
    if (query[key]) {
      if (isArray(query[key])) {
        (query[key] as string[]).push(value);
      } else {
        query[key] = [query[key] as string, value];
      }
    } else {
      query[key] = value;
    }
  });

  return query;
};

export const setLazyProp = <T>(
  req: FortifyRequest,
  prop: string,
  getter: () => T,
): void => {
  const opts = { configurable: true, enumerable: true };
  const optsReset = { ...opts, writable: true };

  Object.defineProperty(req, prop, {
    ...opts,
    get: () => {
      const value = getter();
      // We set the property on the object to avoid recalculating it.
      Object.defineProperty(req, prop, { ...optsReset, value });
      return value;
    },
    set: (value) => {
      Object.defineProperty(req, prop, { ...optsReset, value });
    },
  });
};
