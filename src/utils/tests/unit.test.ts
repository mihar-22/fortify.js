import {
  getConstructor,
  isArray, isNull, isObject, isString, isUndefined,
} from '../unit';

describe('utils', () => {
  describe('unit', () => {
    const expectToBeTrueOnlyFor = (type: string, check: (input: any) => boolean) => {
      const inputs: Record<string, { input: any, isValid?: boolean }> = {
        array: { input: [] },
        string: { input: '' },
        noll: { input: null },
        notDefined: { input: undefined },
        number: { input: 0 },
        object: { input: {} },
        fn: { input: () => {} },
        boolean: { input: true },
      };

      inputs[type].isValid = true;

      Object.values(inputs)
        .forEach((input) => expect(check(input.input)).toBe(input.isValid || false));
    };

    describe('isArray', () => {
      it('should only return true if given a string', () => {
        expectToBeTrueOnlyFor('string', isString);
      });
    });

    describe('isArray', () => {
      it('should only return true if given an array', () => {
        expectToBeTrueOnlyFor('array', isArray);
      });
    });

    describe('isObject', () => {
      it('should only return true if given an object', () => {
        expectToBeTrueOnlyFor('object', isObject);
      });
    });

    describe('isNull', () => {
      it('should only return true if given null', () => {
        expect(isNull(null)).toBeTruthy();
        expect(isNull('')).toBeFalsy();
        expect(isNull(0)).toBeFalsy();
        expect(isNull([])).toBeFalsy();
        expect(isNull({})).toBeFalsy();
        expect(isNull(undefined)).toBeFalsy();
      });
    });

    describe('isUndefined', () => {
      it('should only return true if given undefined', () => {
        expect(isUndefined(null)).toBeFalsy();
        expect(isUndefined('')).toBeFalsy();
        expect(isUndefined(0)).toBeFalsy();
        expect(isUndefined([])).toBeFalsy();
        expect(isUndefined({})).toBeFalsy();
        expect(isUndefined(undefined)).toBeTruthy();
      });
    });

    describe('getConstructor', () => {
      it('should return false given null or undefined', () => {
        expect(getConstructor(null)).toBeFalsy();
        expect(getConstructor(undefined)).toBeFalsy();
      });

      it('should return constructor given valid input', () => {
        const str = 'str';
        expect(getConstructor(str)).toBe(str.constructor);
      });
    });
  });
});
