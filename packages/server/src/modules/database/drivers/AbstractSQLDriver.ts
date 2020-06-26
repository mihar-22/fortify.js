import {
  CreateData, DatabaseDriver, DatabaseDriverId, Filter, Select, UpdateData,
} from './DatabaseDriver';
import { DatabaseEvent, DatabaseEventDispatcher } from '../DatabaseEvent';
import { Event } from '../../events/Event';
import { NamingStrategy, toNamingStrategy } from '../NamingStrategy';

export interface Query {
  text: string
  sql: string
  values: string[]
}

export abstract class AbstractSQLDriver<
  ConfigType = any,
  ResultType = any
> implements DatabaseDriver<ConfigType> {
  public sql = require('sqliterally').sql;

  public query = require('sqliterally').query;

  public config?: ConfigType;

  abstract id: DatabaseDriverId;

  abstract async runQuery(query: Query): Promise<ResultType>;

  constructor(private readonly events: DatabaseEventDispatcher) {}

  public async create(table: string, data: CreateData) {
    const cols = Object.keys(data).join(', ');
    const values = Object.values(data).join(', ');
    const insertIntoClause = this.sql([`INSERT INTO ${table}`]);
    const insertStmt = this.sql`${insertIntoClause} (${cols}) VALUES (${values})`.prefix('');
    this.fireExecEvent(insertStmt);
    const res = await this.runQuery(insertStmt);
    return this.transformCreateRes(res);
  }

  public async read(table: string, filter: Filter, select?: Select) {
    let q = this.query.from([table]);

    Object.keys(filter).forEach((col) => { q = q.where`${col} = ${filter[col]}`; });

    if (select) {
      select.forEach((col) => { q = q.select`${col as string}`; });
    } else {
      q = q.select`*`;
    }

    const readStmt = q.build();
    this.fireExecEvent(readStmt);
    const res = await this.runQuery(readStmt);
    return this.transformReadRes(res);
  }

  public async update(table: string, filter: Filter, data: UpdateData) {
    let q = this.query.update([table]);
    Object.keys(filter).forEach((col) => { q = q.where`${col} = ${filter[col]}`; });
    Object.keys(data).forEach((col) => { q = q.set`${col} = ${data[col]}`; });
    const updateStmt = q.build();
    this.fireExecEvent(updateStmt);
    const res = await this.runQuery(updateStmt);
    return this.transformUpdateRes(res);
  }

  public async delete(table: string, filter: Filter) {
    let q = this.query.from([table]);
    Object.keys(filter).forEach((col) => { q = q.where`${col} = ${filter[col]}`; });
    const deleteStmt = this.sql`DELETE ${q}`;
    this.fireExecEvent(deleteStmt);
    const res = await this.runQuery(deleteStmt);
    return this.transformDeleteRes(res);
  }

  public async dropCollection(collection: string) {
    const dropTableStmt = this.sql([`DROP TABLE ${collection}`]);
    await this.runQuery(dropTableStmt);
  }

  public buildCreateTableQuery(
    tableName: string,
    columns: Record<string, string>,
    namingStrategy: NamingStrategy,
    appendQuery?: Query,
  ): Query {
    const casedColumns = toNamingStrategy(columns, namingStrategy);

    let q = this.sql([`CREATE TABLE ${tableName} (\n`]);

    Object.keys(casedColumns).forEach((column, i) => {
      const end = (Object.keys(casedColumns).length === (i - 1)) ? ',\n' : '\n';
      q = q.append(`\t${column} ${casedColumns[column]}${end}`);
    });

    if (appendQuery) { q = q.append(appendQuery); }
    q = q.append(');');

    return q;
  }

  protected fireExecEvent = (query: Query) => {
    this.events.dispatch(new Event(
      DatabaseEvent.Executing,
      '🔋 Executing query...',
      {
        sql: (this.id === DatabaseDriverId.Postgres)
          ? query.text
          : query.sql,
        values: query.values,
      },
    ));
  };

  protected abstract transformCreateRes(res: ResultType): number;

  protected abstract transformReadRes(res: ResultType): any[];

  protected abstract transformUpdateRes(res: ResultType): number;

  protected abstract transformDeleteRes(res: ResultType): number;
}
