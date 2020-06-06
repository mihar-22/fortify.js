import { addQueryParamsToUrl } from '../url';

describe('utils', () => {
  describe('url', () => {
    describe('addQueryParamsToUrl', () => {
      it('it should append query params to url', () => {
        const url = 'http://apples.com';
        const result = addQueryParamsToUrl(url, {
          a: 1,
          b: 'b',
          c: 'cold',
        });
        expect(result).toBe(`${url}?a=1&b=b&c=cold`);
      });

      it('it should concatenate to an existing query string', () => {
        const url = 'http://apples.com?a=1&b=b';
        const result = addQueryParamsToUrl(url, { c: 'cold' });
        expect(result).toBe(`${url}&c=cold`);
      });

      it('it should append a query params array correctly', () => {
        const url = 'http://apples.com';
        const result = addQueryParamsToUrl(url, {
          a: 1,
          b: [2, 3],
        });
        expect(result).toBe(`${url}?a=1&b=2&b=3`);
      });
    });
  });
});
