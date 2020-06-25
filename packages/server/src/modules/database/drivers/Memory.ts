import { AbstractDbDriver } from './AbstractDbDriver';
import { DbCollection } from '../DbCollection';
import { DatabaseDriver } from '../DatabaseConfig';
import {
  CreateData, Filter, Select, UpdateData,
} from '../Database';

export class Memory extends AbstractDbDriver<void> {
  public driver = DatabaseDriver.Memory;

  private db: Record<string | number, any> = {};

  public async driverCreate(collection: DbCollection, data: CreateData) {
    if (!this.db[collection]) { this.db[collection] = {}; }
    const id = (Object.keys(this.db[collection]).length + 1);
    this.db[collection][id] = { ...data, id };
    return id;
  }

  public async driverRead(collection: DbCollection, filter: Filter, select?: Select) {
    if (!this.db[collection]) { this.db[collection] = {}; }

    const result: any[] = [];
    const c = this.db[collection];

    Object
      .keys(c)
      .filter((id) => {
        const raw = c[id];
        return Object.keys(filter).every((key) => raw[key] === filter[key]);
      })
      .forEach((id) => {
        result.push(
          (!select || select.length === 0)
            ? c[id]
            : select.reduce((obj, key) => ({ ...obj, [key]: c[id][key] }), {}),
        );
      });

    return result;
  }

  public async driverUpdate(collection: DbCollection, filter: Filter, data: UpdateData) {
    if (!this.db[collection]) { this.db[collection] = {}; }
    const records = await this.driverRead(collection, filter);
    records.forEach((record) => { this.db[collection][record.id] = { ...record, ...data }; });
    return records.length;
  }

  public async driverDelete(collection: DbCollection, filter: Filter) {
    const records = await this.driverRead(collection, filter);
    records.forEach((record) => { delete this.db[collection][record.id]; });
    return records.length;
  }

  // For testing.
  public getDb() {
    return this.db;
  }
}
