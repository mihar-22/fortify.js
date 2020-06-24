import { AbstractDbDriver } from './AbstractDbDriver';
import { DbCollection } from '../DbCollection';
import { DatabaseDriver } from '../DatabaseConfig';

export class Memory extends AbstractDbDriver<void> {
  public driver = DatabaseDriver.Memory;

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

  public async performRead<T>(
    collection: DbCollection,
    filter: object,
    select?: object,
  ): Promise<T> {
    // ...
  }

  public async performUpdate(collection: DbCollection, filter: object, data: object) {
    // ...
  }

  public async runTransaction(cb: () => Promise<void>) {
    await cb();
  }
}
