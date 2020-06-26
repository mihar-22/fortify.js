import { bootstrap } from '../../../../bootstrap';
import { coreModules } from '../../../index';
import { DIToken } from '../../../../DIToken';
import { Module } from '../../../Module';
import { Database } from '../../Database';
import { DatabaseDriverId, SQLite } from '../../drivers';
import { EventsModule } from '../../../events/EventsModule';

describe('Database', () => {
  describe('Drivers', () => {
    describe('SQLite', () => {
      let db: Database<SQLite>;

      beforeEach(() => {
        const app = bootstrap(coreModules, {
          [Module.Database]: {
            driver: DatabaseDriverId.SQLite,
          },
        }, true, [EventsModule]);

        // db = app.get(DIToken.Database);
      });

      test('should create data and return id', async () => {
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
