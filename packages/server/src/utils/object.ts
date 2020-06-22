/* eslint-disable no-param-reassign,import/prefer-default-export */

import { isArray, isObject } from './unit';

/**
 * Performs a deep merge of `source` into `target`. Mutates `target` only but not its objects
 * and arrays.
 *
 * @see https://stackoverflow.com/a/48218209
 */
export const mergeObjDeep = (target: any, source: any): object => {
  if (!isObject(target) || !isObject(source)) { return source; }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (isArray(targetValue) && isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeObjDeep({ ...targetValue }, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
};

export const setLazyProp = <T>(
  obj: object,
  prop: string,
  getter: () => T,
): void => {
  const opts = { configurable: true, enumerable: true };
  const optsReset = { ...opts, writable: true };

  Object.defineProperty(obj, prop, {
    ...opts,
    get: () => {
      const value = getter();
      // We set the property on the object to avoid recalculating it.
      Object.defineProperty(obj, prop, { ...optsReset, value });
      return value;
    },
    set: (value) => {
      Object.defineProperty(obj, prop, { ...optsReset, value });
    },
  });
};
