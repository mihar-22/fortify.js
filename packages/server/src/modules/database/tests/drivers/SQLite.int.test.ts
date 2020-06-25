import { bootstrap } from '../../../../bootstrap';
import { coreModules } from '../../../index';
import { Env } from '../../../../Config';
import { Database, DatabaseFactory } from '../../Database';
import { DIToken } from '../../../../DIToken';
import { DatabaseDriver } from '../../DatabaseConfig';
import { Module } from '../../../Module';

describe('Database', () => {
  describe('Drivers', () => {
    describe('SQLite', () => {
      let db: Database;

      beforeEach(() => {
        const app = bootstrap(coreModules, {
          env: Env.Testing,
          [Module.Database]: {
            [DatabaseDriver.SQLite]: ':memory:',
          },
        });
        db = app.get<DatabaseFactory>(DIToken.DatabaseDriverFactory)(DatabaseDriver.SQLite);
      });

      test('should create data in db and return id', async () => {
      });

      test('should read in empty array', async () => {
      });

      test('should read in single item', async () => {
      });

      test('should read in multiple items', async () => {
      });

      test('should return all fields if select is empty', async () => {
      });

      test('should return only selected fields', async () => {
      });

      test('should update item', async () => {
      });

      test('should update multiple items', async () => {
      });

      test('should delete item', async () => {
      });

      test('should delete multiple items', async () => {
      });
    });
  });
});
