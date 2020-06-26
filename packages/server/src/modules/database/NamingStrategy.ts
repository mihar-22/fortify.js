import { camelToSnakeCase, snakeToCamelCase } from '../../utils/string';

export enum NamingStrategy {
  SnakeCase = 'snakeCase',
  CamelCase = 'camelCase',
}

// Assumes default case is camelCase.
export const toNamingStrategy = (obj: any, namingStrategy: NamingStrategy) => {
  if (namingStrategy !== NamingStrategy.SnakeCase) { return obj; }
  const snakedCasedClone: any = {};
  Object.keys(obj).forEach((key) => { snakedCasedClone[camelToSnakeCase(key)] = obj[key]; });
  return snakedCasedClone;
};

// Assumes default case is camelCase.
export const fromNamingStrategy = (obj: any, namingStrategy: NamingStrategy) => {
  if (namingStrategy !== NamingStrategy.SnakeCase) { return obj; }
  const camelCasedClone: any = {};
  Object.keys(obj).forEach((key) => { camelCasedClone[snakeToCamelCase(key)] = obj[key]; });
  return camelCasedClone;
};
