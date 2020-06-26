import { Database, RunResult } from 'sqlite3';
import { promisify } from 'util';
import { AbstractSQLDriver, Query } from './AbstractSQLDriver';
import { DatabaseDriverId } from './DatabaseDriver';

export type SQLiteConfig = string | ':memory:';

export class SQLite extends AbstractSQLDriver<SQLiteConfig> {
  public id = DatabaseDriverId.SQLite;

  private db?: Database;

  private getDb(): Database {
    if (!this.db) {
      const sqlite3 = require('sqlite3');
      this.db = new sqlite3.Database(this.config!);
    }

    return this.db!;
  }

  public async runQuery(query: Query): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDb().run(query.sql, query.values, (res: RunResult, err: Error | null) => {
        if ((res as any)?.code === 'SQLITE_ERROR' || err) {
          reject(err || res);
          return;
        }

        resolve(res);
      });
    });
  }

  public async quit() {
    if (!this.db) { return; }
    await promisify(this.db.close)();
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
