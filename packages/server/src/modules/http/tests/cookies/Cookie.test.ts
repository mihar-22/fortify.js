import dayjs from 'dayjs';
import { Cookie } from '../../cookies/Cookie';

describe('Http', () => {
  describe('Cookie', () => {
    test('expiry is set correctly when making a cookie', () => {
      const cookie = Cookie.make({
        name: 'test',
        value: 'test',
        minutes: 100,
      });

      expect(cookie.expires!.toUTCString())
        .toEqual(dayjs().add(100, 'minute').toDate().toUTCString());
    });
  });
});
