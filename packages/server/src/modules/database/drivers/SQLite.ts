import { DatabaseConfig, DatabaseDriver } from '../DatabaseConfig';
import { AbstractSQLDriver } from './AbstractSQLDriver';

export class SQLite extends AbstractSQLDriver<DatabaseConfig[DatabaseDriver.SQLite]> {
  public driver = DatabaseDriver.SQLite;

  public async performConnect() {
    // ...
  }

  public async performDisconnect() {
    // ...
  }

  public async runQuery<T>(query: string): Promise<T> {
    // ...
  }

  public async runTransaction(cb: () => Promise<void>) {
    // ...
  }
}
