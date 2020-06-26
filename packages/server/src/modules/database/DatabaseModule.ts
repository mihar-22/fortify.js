import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';
import { NamingStrategy } from './NamingStrategy';
import { DIToken } from '../../DIToken';
import {
  Memory,
  MongoDB,
  MySQL,
  Postgres,
  MariaDB,
  SQLite,
  DatabaseDriverId,
  DatabaseDriverFactory,
  DatabaseDriverConstructor,
  DatabaseDriver,
} from './drivers';
import { Migrator } from './Migrator';
import { DatabaseConfig } from './DatabaseConfig';
import { Database } from './Database';
import { FakeDatabaseDriver } from './drivers/FakeDatabaseDriver';

export class DatabaseModule implements ModuleProvider<DatabaseConfig> {
  public static id = Module.Database;

  public static defaults() {
    return {
      driver: DatabaseDriverId.Memory,
      namingStrategy: NamingStrategy.CamelCase,
      collectionPrefix: '',
    };
  }

  constructor(
    private readonly app: App,
    private readonly config: DatabaseConfig,
  ) {}

  // @TODO: Validate config for each db.

  public dependencies() {
    const driver = this.config.driver!;

    switch (driver) {
      case DatabaseDriverId.Memory:
        return [];
      case DatabaseDriverId.MySQL:
      case DatabaseDriverId.MariaDB:
        return ['serverless-mysql', 'sqliterally'];
      case DatabaseDriverId.MongoDB:
        return ['mongodb'];
      case DatabaseDriverId.Postgres:
        return ['pg', 'sqliterally'];
      case DatabaseDriverId.SQLite:
        return ['sqlite3', 'sqliterally'];
    }

    return [];
  }

  public register() {
    this.app.bindFactory<DatabaseDriverFactory>(
      DIToken.DatabaseDriverFactory,
      (id: DatabaseDriverId) => {
        const drivers: Record<DatabaseDriverId, DatabaseDriverConstructor> = {
          [DatabaseDriverId.Memory]: Memory,
          [DatabaseDriverId.MongoDB]: MongoDB,
          [DatabaseDriverId.MySQL]: MySQL,
          [DatabaseDriverId.MariaDB]: MariaDB,
          [DatabaseDriverId.SQLite]: SQLite,
          [DatabaseDriverId.Postgres]: Postgres,
        };

        return new drivers[id](this.app.get(DIToken.EventDispatcher));
      },
    );

    this.app.bindBuilder<() => DatabaseDriver>(DIToken.DatabaseDriver, () => {
      const driver = this.app.get<DatabaseDriverFactory>(
        DIToken.DatabaseDriverFactory,
      )(this.config.driver!);

      driver.config = this.config[this.config.driver!];

      return driver;
    });

    this.app.bindBuilder<() => Database>(DIToken.Database, () => {
      const database = this.app.get(Database);
      database.namingStrategy = this.config.namingStrategy!;
      database.collectionPrefix = this.config.collectionPrefix!;
      return database;
    });

    this.app.bindClass(DIToken.Migrator, Migrator);
  }

  public registerTestingEnv() {
    this.app.bindValue<DatabaseDriver>(DIToken.FakeDatabaseDriver, new FakeDatabaseDriver());
    this.app.bindValue<DatabaseDriver>(
      DIToken.DatabaseDriver,
      this.app.get(DIToken.FakeDatabaseDriver),
    );
  }
}
