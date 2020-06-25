import { Database, RunResult } from 'sqlite3';
import { promisify } from 'util';
import { DatabaseConfig, DatabaseDriver } from '../DatabaseConfig';
import { AbstractSQLDriver, Query } from './AbstractSQLDriver';

export class SQLite extends AbstractSQLDriver<DatabaseConfig[DatabaseDriver.SQLite], any> {
  public driver = DatabaseDriver.SQLite;

  protected db?: Database;

  protected getDb(): Database {
    if (!this.db) {
      const sqlite3 = require('sqlite3');
      this.db = new sqlite3.Database(this.config!);
    }

    return this.db!;
  }

  public async driverQuit() {
    if (!this.db) { return; }
    await promisify(this.db!.close)();
  }

  public async runQuery(query: Query): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDb().run(query.sql, query.values, (res: RunResult, err: Error | null) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res);
      });
    });
  }

  protected transformCreateRes(res: any): number {
    console.log(res);
    return 0;
  }

  protected transformDeleteRes(res: any): number {
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
}
