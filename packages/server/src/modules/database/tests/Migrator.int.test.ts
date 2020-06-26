import { Migrator } from '../Migrator';
import { bootstrap } from '../../../bootstrap';
import { coreModules } from '../../index';
import { DIToken } from '../../../DIToken';
import { Config } from '../../../Config';
import { Module } from '../../Module';
import { DatabaseDriverId } from '../drivers';
import { Database } from '../Database';

describe('Database', () => {
  describe('Migrator', () => {
    let migrator: Migrator;

    let database: Database;

    const boot = (config?: Config) => {
      const app = bootstrap(coreModules, config);
      migrator = app.get(DIToken.Migrator);
      database = app.get(DIToken.Database);
    };

    describe('sqlite', () => {
      beforeEach(() => {
        boot({
          [Module.Database]: {
            driver: DatabaseDriverId.SQLite,
            [DatabaseDriverId.SQLite]: ':memory:',
          },
        });
      });

      test('1-createUsersTable UP', async () => {
        await migrator.up();
      });

      test('1-createUsersTable DOWN', async () => {
        await migrator.down();
      });
    });
  });
});
