import { Pool } from 'mysql';
import { promisify } from 'util';
import { DatabaseConfig, DatabaseDriver } from '../DatabaseConfig';
import { AbstractSQLDriver, Query } from './AbstractSQLDriver';

export class MySQL extends AbstractSQLDriver<DatabaseConfig[DatabaseDriver.MySQL], any> {
  public driver = DatabaseDriver.MySQL;

  protected pool?: Pool;

  protected getPool(): Pool {
    if (!this.pool) {
      const mysql = require('mysql');
      this.pool = mysql.createPool(this.config!);
    }

    return this.pool!;
  }

  protected async driverQuit() {
    if (!this.pool) { return; }
    await promisify(this.pool.end)();
  }

  public async runQuery(query: Query): Promise<any> {
    return promisify(this.getPool().query)({ sql: query.sql, values: query.values });
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
