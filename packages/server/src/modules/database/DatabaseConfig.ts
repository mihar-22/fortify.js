import { NamingStrategy } from './NamingStrategy';
import {
  DatabaseDriverId, MongoDBConfig, MySQLConfig, PostgresConfig, SQLiteConfig,
} from './drivers';

export interface DatabaseConfig {
  driver?: DatabaseDriverId
  namingStrategy?: NamingStrategy
  collectionPrefix?: string
  [DatabaseDriverId.Memory]?: void
  [DatabaseDriverId.MariaDB]?: MySQLConfig
  [DatabaseDriverId.MySQL]?: MySQLConfig
  [DatabaseDriverId.Postgres]?: PostgresConfig
  [DatabaseDriverId.MongoDB]?: MongoDBConfig
  [DatabaseDriverId.SQLite]?: SQLiteConfig
}
