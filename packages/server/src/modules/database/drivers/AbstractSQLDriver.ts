import { AbstractDbDriver } from './AbstractDbDriver';
import { DbCollection } from '../DbCollection';

export abstract class AbstractSQLDriver<ConfigType> extends AbstractDbDriver<ConfigType> {
  abstract async runQuery<T>(query: string): Promise<T>;

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
}
