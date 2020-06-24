import { AbstractDbDriver } from './AbstractDbDriver';
import { DbCollection } from '../DbCollection';
import {
  CreateData, Filter, Select, UpdateData,
} from '../Database';

export abstract class AbstractSQLDriver<ConfigType> extends AbstractDbDriver<ConfigType> {
  abstract async runQuery<T>(query: string): Promise<T>;

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
