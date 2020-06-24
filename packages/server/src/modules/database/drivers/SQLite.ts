import { DatabaseConfig, DatabaseDriver } from '../DatabaseConfig';
import { AbstractSQLDriver } from './AbstractSQLDriver';

export class SQLite extends AbstractSQLDriver<DatabaseConfig[DatabaseDriver.SQLite]> {
  public driver = DatabaseDriver.SQLite;

  public async driverConnect() {
    // ...
  }

  public async driverDisconnect() {
    // ...
  }

  public async runQuery<T>(query: string): Promise<T> {
    // ...
  }

  public async runTransaction(cb: () => Promise<void>) {
    await cb();
  }
}
