import { DatabaseConfig, DatabaseDriver } from '../DatabaseConfig';
import { AbstractSQLDriver } from './AbstractSQLDriver';

export class Postgres extends AbstractSQLDriver<DatabaseConfig[DatabaseDriver.Postgres]> {
  public driver = DatabaseDriver.Postgres;

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
