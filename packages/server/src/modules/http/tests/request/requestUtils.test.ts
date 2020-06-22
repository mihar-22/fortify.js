import { parseBody, parseCookies, parseQuery } from '../../request/requestUtils';

describe('Http', () => {
  describe('requestUtils', () => {
    describe('parseBody', () => {
      test('returns body immediately if available', async () => {
        const req: any = {
          body: {
            a: 1,
          },
        };

        const body = await parseBody(req, '1mb');
        expect(body).toBe(req.body);
      });
    });

    describe('parseCookies', () => {
      test('cookies are extracted from the header and parsed', () => {
        const req: any = { headers: { cookie: 'foo=bar;HttpOnly;Secure;bar=foo' } };
        expect(parseCookies(req)).toEqual({ foo: 'bar', bar: 'foo' });
      });
    });

    describe('parseQuery', () => {
      test('should return only search params', () => {
        const req: any = { url: 'http://localhost:8080/index.html?foo=bar&key=12&id=false' };
        expect(parseQuery(req)).toEqual({ foo: 'bar', key: '12', id: 'false' });
      });

      test('multiple query params with same key are grouped into an array', () => {
        const req: any = { url: 'http://localhost:8080/index.html?foo=1&foo=2&foo=3' };
        expect(parseQuery(req)).toEqual({ foo: ['1', '2', '3'] });
      });
    });
  });
});
