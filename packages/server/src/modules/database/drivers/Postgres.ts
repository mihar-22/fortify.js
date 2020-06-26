import { ClientConfig, Pool, QueryResult } from 'pg';
import { AbstractSQLDriver, Query } from './AbstractSQLDriver';
import { DatabaseDriverId } from './DatabaseDriver';

export type PostgresConfig = string | ClientConfig;

export class Postgres extends AbstractSQLDriver<PostgresConfig> {
  public id = DatabaseDriverId.Postgres;

  private pool?: Pool;

  private getPool(): Pool {
    if (!this.pool) {
      const pg = require('pg');
      this.pool = new pg.Pool();
    }

    return this.pool!;
  }

  public async runQuery(query: Query): Promise<QueryResult> {
    return this.getPool().query(query.text, query.values);
  }

  public async quit() {
    return this.pool?.end();
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
