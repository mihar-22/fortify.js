import {
  CreateData,
  Database, Filter, Select, UpdateData,
} from '../Database';
import { NamingStrategy } from '../NamingStrategy';
import { DbCollection } from '../DbCollection';
import { Event } from '../../events/Event';
import { DatabaseEvent, DatabaseEventDispatcher } from '../DatabaseEvent';
import { camelToSnakeCase, snakeToCamelCase } from '../../../utils/string';
import { DatabaseDriver } from '../DatabaseConfig';

export abstract class AbstractDbDriver<ConfigType> implements Database<ConfigType> {
  public config?: ConfigType;

  constructor(
    protected readonly events: DatabaseEventDispatcher,
    public readonly namingStrategy: NamingStrategy,
  ) {}

  public async quit() {
    if (!this.driverQuit) { return; }
    await this.driverQuit();
  }

  public async create<T>(collection: DbCollection, data: CreateData<T>) {
    const nData = this.toNamingStrategy(data);
    const nCollection = this.toNamingStrategy(collection);

    const id = await this.driverCreate(nCollection, nData);

    this.events.dispatch(new Event(
      DatabaseEvent.Created,
      `💾 Created new entry in \`${nCollection}\` collection.`,
      { id, collection: nCollection, data: nData },
    ));

    return id;
  }

  public async read<T>(collection: DbCollection, filter: Filter<T>, select?: Select<T>) {
    const nFilter = this.toNamingStrategy(filter);
    const nCollection = this.toNamingStrategy(collection);
    const nSelect = select ? this.toNamingStrategy(select) : undefined;

    const data = await this.driverRead(nCollection, nFilter, nSelect);

    this.events.dispatch(new Event(
      DatabaseEvent.Read,
      `💾 Performed read on \`${nCollection}\` collection.`,
      {
        collection: nCollection, filter: nFilter, select: nSelect, data,
      },
    ));

    return this.fromNamingStrategy(data);
  }

  public async update<T>(collection: DbCollection, filter: Filter<T>, data: UpdateData<T>) {
    const nFilter = this.toNamingStrategy(filter);
    const nData = this.toNamingStrategy(data);
    const nCollection = this.toNamingStrategy(collection);

    const affectedItems = await this.driverUpdate(nCollection, nFilter, nData);

    this.events.dispatch(new Event(
      DatabaseEvent.Updated,
      `💾 Updated ${affectedItems} items in \`${nCollection}\` collection.`,
      { collection: nCollection, filter: nFilter, data: nData },
    ));

    return affectedItems;
  }

  public async delete<T>(collection: DbCollection, filter: Filter<T>) {
    const nFilter = this.toNamingStrategy(filter);
    const nCollection = this.toNamingStrategy(collection);

    const affectedItems = await this.driverDelete(nCollection, nFilter);

    this.events.dispatch(new Event(
      DatabaseEvent.Deleted,
      `💾 Deleted ${affectedItems} items in \`${nCollection}\` collection.`,
      { collection: nCollection, filter: nFilter },
    ));

    return affectedItems;
  }

  public setConfig(config: ConfigType) {
    this.config = config;
  }

  private toNamingStrategy = (obj: any) => {
    if (this.namingStrategy !== NamingStrategy.SnakeCase) { return obj; }
    const snakedCasedClone: any = {};
    Object.keys(obj).forEach((key) => { snakedCasedClone[camelToSnakeCase(key)] = obj[key]; });
    return snakedCasedClone;
  };

  private fromNamingStrategy = (obj: any) => {
    if (this.namingStrategy !== NamingStrategy.SnakeCase) { return obj; }
    const camelCasedClone: any = {};
    Object.keys(obj).forEach((key) => { camelCasedClone[snakeToCamelCase(key)] = obj[key]; });
    return camelCasedClone;
  };

  abstract driver: DatabaseDriver;

  protected async driverQuit?(): Promise<void>;

  abstract async driverCreate(collection: DbCollection, data: any): Promise<number>;

  abstract async driverRead(
    collection: DbCollection,
    filter: Filter,
    select?: Select
  ): Promise<any[]>;

  abstract async driverUpdate(collection: DbCollection,
    filter: Filter,
    data: UpdateData
  ): Promise<number>;

  abstract async driverDelete(collection: DbCollection, filter: Filter): Promise<number>;
}
