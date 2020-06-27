import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';
import { NamingStrategy } from './NamingStrategy';
import { DIToken } from '../../DIToken';
import {
  DatabaseDriver,
  DatabaseDriverConstructor,
  DatabaseDriverFactory,
  DatabaseDriverId,
  FakeDatabaseDriver,
  Knex,
  Memory,
  MongoDB,
} from './drivers';
import { Migrator } from './Migrator';
import { DatabaseConfig } from './DatabaseConfig';
import { Database } from './Database';
import { DatabaseError } from './DatabaseError';

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

  public configValidation() {
    const driver = this.config.driver!;
    const isMemoryDriver = (driver === DatabaseDriverId.Memory);

    if (this.app.isProductionEnv && !this.config.allowMemoryDriverInProduction && isMemoryDriver) {
      return {
        code: DatabaseError.MemoryDriverUsedInProduction,
        message: 'Memory driver has been selected in production, if you want to allow this then'
          + 'set `config.database.allowMemoryDriverInProduction` to `true``',
        path: 'driver',
      };
    }

    if (!isMemoryDriver && !this.app.configPathExists(Module.Database, driver)) {
      return {
        code: DatabaseError.MissingDriverConfig,
        message: `The database driver [${driver}] was selected but no configuration was found.`,
        path: driver,
      };
    }

    return undefined;
  }

  public dependencies() {
    const driver = this.config.driver!;

    switch (driver) {
      case DatabaseDriverId.Memory:
        return [];
      case DatabaseDriverId.MongoDB:
        return ['mongodb'];
      case DatabaseDriverId.MySQL:
      case DatabaseDriverId.MariaDB:
        return ['knex', 'mysql'];
      case DatabaseDriverId.MySQL2:
        return ['knex', 'mysql2'];
      case DatabaseDriverId.OracleDB:
        return ['knex', 'oracledb'];
      case DatabaseDriverId.MSSQL:
        return ['knex', 'mssql'];
      case DatabaseDriverId.Postgres:
        return ['knex', 'pg'];
      case DatabaseDriverId.SQLite:
        return ['knex', 'sqlite3'];
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
          [DatabaseDriverId.MySQL]: Knex,
          [DatabaseDriverId.MySQL2]: Knex,
          [DatabaseDriverId.MariaDB]: Knex,
          [DatabaseDriverId.Postgres]: Knex,
          [DatabaseDriverId.SQLite]: Knex,
          [DatabaseDriverId.OracleDB]: Knex,
          [DatabaseDriverId.MSSQL]: Knex,
        };

        const driver = new drivers[id]();
        driver.id = id;
        return driver;
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
