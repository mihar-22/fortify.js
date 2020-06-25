import { AbstractDbDriver } from './AbstractDbDriver';
import { DbCollection } from '../DbCollection';
import {
  CreateData, Filter, Select, UpdateData,
} from '../Database';
import { DatabaseEvent } from '../DatabaseEvent';
import { Event } from '../../events/Event';
import { DatabaseDriver } from '../DatabaseConfig';

export interface Query {
  text: string
  sql: string
  values: string[]
}

export abstract class AbstractSQLDriver<
  ConfigType,
  ResultType
> extends AbstractDbDriver<ConfigType> {
  public sql = require('sqliterally').sql;

  public query = require('sqliterally').query;

  abstract async runQuery(query: Query): Promise<ResultType>;

  public async driverCreate(table: DbCollection, data: CreateData) {
    const cols = Object.keys(data).join(', ');
    const values = Object.values(data).join(', ');
    const insertQuery = this.sql`INSERT INTO ${table} (${cols}) VALUES (${values})`;
    this.fireExecEvent(insertQuery);
    const res = await this.runQuery(insertQuery);
    return this.transformCreateRes(res);
  }

  public async driverRead(table: DbCollection, filter: Filter, select?: Select) {
    let q = this.query.from`${table}`;
    Object.keys(filter).forEach((col) => { q = q.where`${col} = ${filter[col]}`; });

    if (select) {
      select.forEach((col) => { q = q.select`${col as string}`; });
    } else {
      q = q.select`*`;
    }

    const readQuery = q.build();
    console.log(readQuery.text);
    this.fireExecEvent(readQuery);
    const res = await this.runQuery(readQuery);
    return this.transformReadRes(res);
  }

  public async driverUpdate(table: DbCollection, filter: Filter, data: UpdateData) {
    let q = this.query.update`${table}`;
    Object.keys(filter).forEach((col) => { q = q.where`${col} = ${filter[col]}`; });
    Object.keys(data).forEach((col) => { q = q.set`${col} = ${data[col]}`; });
    const updateQuery = q.build();
    this.fireExecEvent(updateQuery);
    const res = await this.runQuery(updateQuery);
    return this.transformUpdateRes(res);
  }

  public async driverDelete(table: DbCollection, filter: Filter) {
    let whereStmt = this.query;
    Object.keys(filter).forEach((col) => { whereStmt = whereStmt.where`${col} = ${filter[col]}`; });
    const deleteQuery = this.sql`DELETE FROM ${table} ${whereStmt}`;
    this.fireExecEvent(deleteQuery);
    const res = await this.runQuery(deleteQuery);
    return this.transformDeleteRes(res);
  }

  protected fireExecEvent = (query: Query) => {
    this.events.dispatch(new Event(
      DatabaseEvent.Executing,
      '🔋 Executing query...',
      {
        sql: (this.driver === DatabaseDriver.Postgres)
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
