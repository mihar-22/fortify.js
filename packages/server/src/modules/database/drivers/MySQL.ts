import { ConnectionConfig, Pool } from 'mysql';
import { promisify } from 'util';
import { AbstractSQLDriver, Query } from './AbstractSQLDriver';
import { DatabaseDriverId } from './DatabaseDriver';

export type MySQLConfig = string | ConnectionConfig;

export class MySQL extends AbstractSQLDriver<MySQLConfig> {
  public id = DatabaseDriverId.MySQL;

  private pool?: Pool;

  private getPool(): Pool {
    if (!this.pool) {
      const mysql = require('mysql');
      this.pool = mysql.createPool(this.config!);
    }

    return this.pool!;
  }

  public async runQuery(query: Query): Promise<any> {
    return promisify(this.getPool().query)({ sql: query.sql, values: query.values });
  }

  public async quit() {
    if (!this.pool) { return; }
    await promisify(this.pool.end)();
  }

  protected transformCreateRes(res: any): number {
    console.log(res);
    return 0;
  }

  protected transformReadRes(res: any): any[] {
    console.log(res);
    return [];
  }

  protected transformUpdateRes(res: any): number {
    console.log(res);
    return 0;
  }

  protected transformDeleteRes(res: any): number {
    console.log(res);
    return 0;
  }
}
