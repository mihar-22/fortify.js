import { IncomingMessage, ServerResponse } from 'http';
import getRawBody from 'raw-body';
import { URL } from 'url';
import qs from 'querystring';
import { HttpError } from '../../../support/errors';
import { Module } from '../../Module';
import { isArray, isObject } from '../../../utils';
import { Cookie } from '../cookies/Cookie';
import { TrustedProxies } from '../HttpConfig';
import { Cookies, Query } from './RequestInfo';
import { HttpErr } from '../HttpErr';

const { parse } = require('content-type');
const proxyaddr = require('proxy-addr');

export const sendJsonResponse = (res: ServerResponse, body?: object) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.write(JSON.stringify(body ?? {}));
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

export const parseJsonBody = (str: string): object => {
  if (str.length === 0) { return {}; }

  try {
    return JSON.parse(str);
  } catch (e) {
    throw new HttpError(
      HttpErr.InvalidRequestJson,
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
        HttpErr.RequestBodyTooLarge,
        `Request body exceeded limit [${limit}]`,
        Module.Http,
        413,
      );
    } else {
      throw new HttpError(
        HttpErr.InvalidRequestBody,
        'Request body is invalid/malformed.',
        Module.Http,
        400,
      );
    }
  }

  const body = buffer.toString();

  if (type === 'application/json' || type === 'application/ld+json') {
    return parseJsonBody(body);
  }

  if (type === 'application/x-www-form-urlencoded') {
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

export const compileTrust = (trust?: TrustedProxies) => {
  if (typeof trust === 'function') return trust;

  // Support plain true/false.
  if (trust === true) { return () => true; }

  // Support trusting hop count.
  if (typeof trust === 'number') {
    return (ip: string, distanceFromSocket: number) => distanceFromSocket < trust;
  }

  // Support comma-separated values.
  return proxyaddr.compile((typeof trust === 'string') ? trust.split(/ *, */) : (trust || []));
};
