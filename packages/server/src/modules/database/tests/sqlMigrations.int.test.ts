import { Migrator } from '../Migrator';
import { bootstrap } from '../../../bootstrap';
import { coreModules } from '../../index';
import { DIToken } from '../../../DIToken';
import { Config } from '../../../Config';
import { Module } from '../../Module';
import { DatabaseDriverId } from '../drivers';
import { Database } from '../Database';

describe('Database', () => {
  describe('SQL Migrations', () => {
    let migrator: Migrator;

    let database: Database;

    const boot = (config?: Config) => {
      const app = bootstrap(coreModules, config);
      migrator = app.get(DIToken.Migrator);
      database = app.get(DIToken.Database);
    };

    beforeEach(() => {
      boot({
        [Module.Database]: {
          driver: DatabaseDriverId.SQLite,
          [DatabaseDriverId.SQLite]: {
            connection: {
              filename: ':memory:',
            },
          },
        },
      });
    });

    test('up migrations', async () => {
      await migrator.up();

      // database is persisting.

      // const builder = database.driver.getBuilder();

      // console.log(await builder.raw('select * from sqlite_master;'));
    });

    test('down migrations', async () => {
      await migrator.down();
    });

    test('refresh migrations', async () => {
    });
  });
});
