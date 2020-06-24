import { camelToSnakeCase, snakeToCamelCase } from '../string';

describe('utils', () => {
  describe('string', () => {
    test('should convert camel case to snake case', () => {
      expect(camelToSnakeCase('camel')).toEqual('camel');
      expect(camelToSnakeCase('camelCase')).toEqual('camel_case');
      expect(camelToSnakeCase('camelCaseLong')).toEqual('camel_case_long');
    });

    test('should convert snake case to camel case', () => {
      expect(snakeToCamelCase('snake')).toEqual('snake');
      expect(snakeToCamelCase('snake_case')).toEqual('snakeCase');
      expect(snakeToCamelCase('snake_case_long')).toEqual('snakeCaseLong');
      expect(snakeToCamelCase('snake_case_Long')).toEqual('snakeCaseLong');
    });
  });
});
