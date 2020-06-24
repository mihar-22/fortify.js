import { AbstractDbDriver } from './AbstractDbDriver';
import { DatabaseConfig, DatabaseDriver } from '../DatabaseConfig';
import { DbCollection } from '../DbCollection';

export class MongoDB extends AbstractDbDriver<DatabaseConfig[DatabaseDriver.MongoDB]> {
  public driver = DatabaseDriver.MongoDB;

  public async performConnect() {
    // ...
  }

  public async performDisconnect() {
    // ...
  }

  public async performCreate(collection: DbCollection, data: object) {
    return '';
  }

  public async performDelete(collection: DbCollection, filter: object) {
    // ...
  }

  public async performRead<T>(collection: DbCollection, filter: object, select?: object) {
    // ...
  }

  public async performUpdate(
    collection: DbCollection,
    filter: object,
    data: object,
  ) {
    // ...
  }

  public async runTransaction(cb: () => Promise<void>) {
    await cb();
  }
}
