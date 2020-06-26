import { camelToSnakeCase, snakeToCamelCase } from '../../utils/string';
import { isString } from '../../utils';

export enum NamingStrategy {
  SnakeCase = 'snakeCase',
  CamelCase = 'camelCase',
}

// Assumes default case is camelCase.
export const toNamingStrategy = (
  input: string | Record<string, any>,
  namingStrategy: NamingStrategy,
) => {
  if (namingStrategy !== NamingStrategy.SnakeCase) { return input; }
  if (isString(input)) { return camelToSnakeCase(input as string); }
  const snakedCasedClone: any = {};
  Object.keys(input).forEach((key) => {
    snakedCasedClone[camelToSnakeCase(key)] = (input as any)[key];
  });
  return snakedCasedClone;
};

// Assumes default case is camelCase.
export const fromNamingStrategy = (
  input: string | Record<string, any>,
  namingStrategy: NamingStrategy,
) => {
  if (namingStrategy !== NamingStrategy.SnakeCase) { return input; }
  if (isString(input)) { return snakeToCamelCase(input as string); }
  const camelCasedClone: any = {};
  Object.keys(input).forEach((key) => {
    camelCasedClone[snakeToCamelCase(key)] = (input as any)[key];
  });
  return camelCasedClone;
};
