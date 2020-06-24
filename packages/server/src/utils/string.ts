export const camelToSnakeCase = (input: string) => input
  .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const snakeToCamelCase = (input: string) => input
  .toLowerCase()
  .replace(/([_][a-z])/g, (group) => group
    .toUpperCase()
    .replace('_', ''));
