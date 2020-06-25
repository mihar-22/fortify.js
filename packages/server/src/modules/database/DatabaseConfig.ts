import { ConnectionConfig as MySQLConfig } from 'mysql';
import { ClientConfig as PostgresConfig } from 'pg';
import { MongoClientOptions as MongoDBConfig } from 'mongodb';
import { NamingStrategy } from './NamingStrategy';

export enum DatabaseDriver {
  Memory = 'memory',
  MySQL = 'mysql',
  MariaDB = 'mariadb',
  Postgres = 'postgres',
  SQLite = 'sqlite',
  MongoDB = 'mongo',
}

export interface DatabaseConfig {
  driver?: DatabaseDriver
  namingStrategy?: NamingStrategy
  [DatabaseDriver.Memory]?: void
  [DatabaseDriver.MariaDB]?: string | MySQLConfig
  [DatabaseDriver.MySQL]?: string | MySQLConfig
  [DatabaseDriver.Postgres]?: string | PostgresConfig
  [DatabaseDriver.MongoDB]?: ({ uri: string, database: string } & MongoDBConfig)
  [DatabaseDriver.SQLite]?: string | ':memory:'
}
