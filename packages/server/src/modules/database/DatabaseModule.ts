import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';
import { DatabaseConfig, DatabaseDriver } from './DatabaseConfig';
import { NamingStrategy } from './NamingStrategy';
import { DIToken } from '../../DIToken';
import {
  Memory, MongoDB, MySQL,
  Postgres, MariaDB, SQLite,
} from './drivers';
import { Database, DatabaseConstructor, DatabaseFactory } from './Database';
import { FakeDatabase } from './FakeDatabase';
import { Migrator } from './Migrator';

export class DatabaseModule implements ModuleProvider<DatabaseConfig> {
  public static id = Module.Database;

  public static defaults() {
    return {
      driver: DatabaseDriver.Memory,
      namingStrategy: NamingStrategy.CamelCase,
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
      case DatabaseDriver.Memory:
        return [];
      case DatabaseDriver.MySQL:
      case DatabaseDriver.MariaDB:
        return ['serverless-mysql', 'sqliterally'];
      case DatabaseDriver.MongoDB:
        return ['mongodb'];
      case DatabaseDriver.Postgres:
        return ['pg', 'sqliterally'];
      case DatabaseDriver.SQLite:
        return ['sqlite3', 'sqliterally'];
    }

    return [];
  }

  public register() {
    this.app.bindFactory<DatabaseFactory>(
      DIToken.DatabaseDriverFactory,
      (driver: DatabaseDriver) => {
        const drivers: Record<DatabaseDriver, DatabaseConstructor> = {
          [DatabaseDriver.Memory]: Memory,
          [DatabaseDriver.MongoDB]: MongoDB,
          [DatabaseDriver.MySQL]: MySQL,
          [DatabaseDriver.MariaDB]: MariaDB,
          [DatabaseDriver.SQLite]: SQLite,
          [DatabaseDriver.Postgres]: Postgres,
        };

        const db = new drivers[driver](
          this.app.get(DIToken.EventDispatcher),
          this.config.namingStrategy!,
        );

        db.setConfig(this.config[driver]);
        return db;
      },
    );

    this.app.bindBuilder<() => Database>(DIToken.Database, () => this.app
      .get<DatabaseFactory>(DIToken.DatabaseDriverFactory)(this.config!.driver!));

    this.app.bindClass(DIToken.Migrator, Migrator);
  }

  public registerTestingEnv() {
    this.app.bindValue(DIToken.FakeDatabase, new FakeDatabase(this.config.namingStrategy!));
    this.app.bindValue(DIToken.Database, this.app.get(DIToken.FakeDatabase));
  }
}
