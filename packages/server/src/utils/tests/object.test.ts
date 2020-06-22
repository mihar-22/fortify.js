import { mergeObjDeep, setLazyProp } from '../object';

describe('utils', () => {
  describe('object', () => {
    describe('mergeObjDeep', () => {
      const target = {
        a: 1,
        b: 2,
        c: {
          a: 4,
          b: 1,
        },
        d: [1, 2, 3],
      };

      const source = {
        b: 4,
        c: {
          c: {
            a: 1,
          },
          d: [1, 2, 3],
        },
        d: [4, 5],
      };

      it('should deep merge source into target', () => {
        const result = mergeObjDeep(target, source);

        expect(result).toEqual({
          a: 1,
          b: 4,
          c: {
            a: 4,
            b: 1,
            c: {
              a: 1,
            },
            d: [1, 2, 3],
          },
          d: [1, 2, 3, 4, 5],
        });
      });
    });

    describe('setLazyProp', () => {
      test('prop is resolved lazily', () => {
        const o: any = {};
        const createProp = jest.fn();
        setLazyProp(o, 'lazyProp', createProp);
        expect(createProp).not.toHaveBeenCalled();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        o.lazyProp;
        expect(createProp).toHaveBeenCalled();
      });
    });
  });
});
