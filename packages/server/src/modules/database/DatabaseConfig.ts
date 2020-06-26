import { NamingStrategy } from './NamingStrategy';
import {
  DatabaseDriverId, MongoDBConfig,
  MariaDBConfig, MSSQLConfig,
  MySQL2Config, MySQLConfig,
  OracleDBConfig, PostgresConfig,
  SQLiteConfig,
} from './drivers';

export interface DatabaseConfig {
  driver: DatabaseDriverId
  namingStrategy?: NamingStrategy
  collectionPrefix?: string
  allowMemoryDriverInProduction?: boolean
  [DatabaseDriverId.Memory]?: void
  [DatabaseDriverId.MongoDB]?: MongoDBConfig
  [DatabaseDriverId.MySQL]?: MySQLConfig
  [DatabaseDriverId.MySQL2]?: MySQL2Config
  [DatabaseDriverId.MariaDB]?: MariaDBConfig
  [DatabaseDriverId.Postgres]?: PostgresConfig
  [DatabaseDriverId.SQLite]?: SQLiteConfig
  [DatabaseDriverId.OracleDB]?: OracleDBConfig
  [DatabaseDriverId.MSSQL]?: MSSQLConfig
}
