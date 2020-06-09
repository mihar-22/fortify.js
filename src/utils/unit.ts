// eslint-disable-next-line import/prefer-default-export
export const isUndefined = (input: any) => typeof input === 'undefined';

export const isNull = (input: any) => input === null;

export const isNullOrUndefined = (input: any) => isNull(input) || isUndefined(input);

export const getConstructor = (input: any) => (
  !isNullOrUndefined(input) ? input.constructor : undefined
);

export const isString = (input: any) => getConstructor(input) === String;

export const isObject = (input: any) => getConstructor(input) === Object;

export const isArray = (input: any) => Array.isArray(input);
