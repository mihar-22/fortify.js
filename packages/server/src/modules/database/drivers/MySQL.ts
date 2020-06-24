import { DatabaseConfig, DatabaseDriver } from '../DatabaseConfig';
import { AbstractSQLDriver } from './AbstractSQLDriver';

export class MySQL extends AbstractSQLDriver<DatabaseConfig[DatabaseDriver.MySQL]> {
  public driver = DatabaseDriver.MySQL;

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
