import KnexBuilder, {
  MsSqlConnectionConfig, MySqlConnectionConfig,
  OracleDbConnectionConfig, PgConnectionConfig,
  Sqlite3ConnectionConfig,
} from 'knex';
import {
  CreateData, DatabaseDriver,
  DatabaseDriverId, Filter,
  Select, UpdateData,
} from './DatabaseDriver';

export type MySQLConfig = MySqlConnectionConfig;
export type MySQL2Config = MySqlConnectionConfig;
export type MariaDBConfig = MySqlConnectionConfig;
export type PostgresConfig = PgConnectionConfig;
export type SQLiteConfig = Sqlite3ConnectionConfig;
export type OracleDBConfig = OracleDbConnectionConfig;
export type MSSQLConfig = MsSqlConnectionConfig;

export type SQLConfig = MySQLConfig
| MySQL2Config
| MariaDBConfig
| PostgresConfig
| SQLiteConfig
| OracleDBConfig
| MSSQLConfig;

export class Knex implements DatabaseDriver<SQLConfig> {
  public id?: DatabaseDriverId;

  public config?: SQLConfig;

  private builder?: KnexBuilder;

  public getBuilder(): KnexBuilder {
    if (!this.builder) {
      this.builder = require('knex')(this.config!);
    }

    return this.builder!;
  }

  public async create(collection: string, data: CreateData) {
    const res = await this.getBuilder().insert(data).into(collection).returning('id');
    return res[0] as number;
  }

  public async read(collection: string, filter: Filter, select?: Select) {
    return this.getBuilder().select(...(select ?? [])).from(collection).where(filter);
  }

  public async update(collection: string, filter: Filter, data: UpdateData) {
    return this.getBuilder()(collection).where(filter).update(data);
  }

  public async delete(collection: string, filter: Filter) {
    return this.getBuilder()(collection).where(filter).del();
  }

  public async dropCollection(collection: string) {
    await this.getBuilder().schema.dropTable(collection);
  }
}
