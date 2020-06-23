import { CookieJar } from '../../cookies/CookieJar';

describe('Http', () => {
  describe('CookieJar', () => {
    let cookies: CookieJar;

    beforeEach(() => {
      cookies = new CookieJar();
    });

    test('should create and queue cookie', () => {
      cookies.make({ name: 'test', value: '' });
      expect(cookies.hasQueued('test'));
    });

    test('should dequeue cookie', () => {
      cookies.make({ name: 'test', value: '' });
      cookies.dequeue('test');
      expect(cookies.hasQueued('test')).toBeFalsy();
    });

    test('should return queued cookie', () => {
      cookies.queue({ name: 'test', value: 'apples' });
      expect(cookies.getQueued('test')?.value).toEqual('apples');
    });

    test('should attach cookie to response', () => {
      cookies.queue({ name: 'c1', value: 'v1' });
      cookies.queue({ name: 'c2', value: 'v2' });

      const res = {
        setHeader: jest.fn(),
      };

      cookies.attachTo(res as any);

      expect(res.setHeader).toBeCalledWith(
        'Set-Cookie',
        '__Host-c1=v1; Path=/; HttpOnly; Secure; SameSite=Strict',
      );

      expect(res.setHeader).toBeCalledWith(
        'Set-Cookie',
        '__Host-c2=v2; Path=/; HttpOnly; Secure; SameSite=Strict',
      );
    });
  });
});
