import { AbstractDbDriver } from './AbstractDbDriver';
import { DatabaseConfig, DatabaseDriver } from '../DatabaseConfig';
import { DbCollection } from '../DbCollection';
import {
  CreateData, Filter, Select, UpdateData,
} from '../Database';

export class MongoDB extends AbstractDbDriver<DatabaseConfig[DatabaseDriver.MongoDB]> {
  public driver = DatabaseDriver.MongoDB;

  public async driverConnect() {
    // ...
  }

  public async driverDisconnect() {
    // ...
  }

  public async runTransaction(cb: () => Promise<void>) {
    await cb();
  }

  public async driverCreate(collection: DbCollection, data: CreateData) {
    return 1;
  }

  public async driverRead(collection: DbCollection, filter: Filter, select?: Select) {
    return [];
  }

  public async driverUpdate(collection: DbCollection, filter: Filter, data: UpdateData) {
    return 1;
  }

  public async driverDelete(collection: DbCollection, filter: Filter) {
    return 1;
  }
}
