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
