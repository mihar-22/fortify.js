import { Pool, QueryResult } from 'pg';
import { DatabaseConfig, DatabaseDriver } from '../DatabaseConfig';
import { AbstractSQLDriver, Query } from './AbstractSQLDriver';

export class Postgres extends AbstractSQLDriver<
DatabaseConfig[DatabaseDriver.Postgres],
QueryResult
> {
  public driver = DatabaseDriver.Postgres;

  protected pool?: Pool;

  protected getPool(): Pool {
    if (!this.pool) {
      const pg = require('pg');
      this.pool = new pg.Pool();
    }

    return this.pool!;
  }

  public async driverQuit() {
    return this.pool?.end();
  }

  public async runQuery(query: Query): Promise<QueryResult> {
    return this.getPool().query(query.text, query.values);
  }

  protected transformCreateRes(res: QueryResult): number {
    return res.rows[0].id;
  }

  protected transformDeleteRes(res: QueryResult): number {
    return res.rowCount;
  }

  protected transformReadRes(res: QueryResult): any[] {
    return res.rows;
  }

  protected transformUpdateRes(res: QueryResult): number {
    return res.rowCount;
  }
}
