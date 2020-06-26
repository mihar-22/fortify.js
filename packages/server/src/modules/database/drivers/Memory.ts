import {
  CreateData, DatabaseDriver, DatabaseDriverId, Filter, Select, UpdateData,
} from './DatabaseDriver';

export class Memory implements DatabaseDriver<undefined> {
  public id = DatabaseDriverId.Memory;

  private db: Record<string | number, any> = {};

  public async create(collection: string, data: CreateData) {
    this.createCollection(collection);
    const id = (Object.keys(this.db[collection]).length + 1);
    this.db[collection][id] = { ...data, id };
    return id;
  }

  public async read(collection: string, filter: Filter, select?: Select) {
    this.createCollection(collection);

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

  public async update(collection: string, filter: Filter, data: UpdateData) {
    this.createCollection(collection);
    const records = await this.read(collection, filter);
    records.forEach((record) => { this.db[collection][record.id] = { ...record, ...data }; });
    return records.length;
  }

  public async delete(collection: string, filter: Filter) {
    const records = await this.read(collection, filter);
    records.forEach((record) => { delete this.db[collection][record.id]; });
    return records.length;
  }

  // For testing.
  public getDb() {
    return this.db;
  }

  public createCollection(collection: string) {
    if (!this.db[collection]) { this.db[collection] = {}; }
  }

  public async dropCollection(collection: string) {
    delete this.db[collection];
  }
}
