import { inject, injectable } from 'tsyringe';
import { DatabaseEvent, DatabaseEventDispatcher } from './DatabaseEvent';
import { fromNamingStrategy, NamingStrategy, toNamingStrategy } from './NamingStrategy';
import { DbCollection } from './DbCollection';
import { Event } from '../events/Event';
import {
  CreateData,
  DatabaseDriver,
  DatabaseDriverId,
  Filter,
  Select,
  UpdateData,
} from './drivers';
import { DIToken } from '../../DIToken';

@injectable()
export class Database<DriverType extends DatabaseDriver = DatabaseDriver> {
  public collectionPrefix = '';

  public namingStrategy = NamingStrategy.CamelCase;

  constructor(
    @inject(DIToken.DatabaseDriver) public readonly driver: DriverType,
    @inject(DIToken.EventDispatcher) private readonly events: DatabaseEventDispatcher,
  ) {}

  public get isSQLDriver() {
    const sqlDrivers = [
      DatabaseDriverId.MySQL,
      DatabaseDriverId.SQLite,
      DatabaseDriverId.Postgres,
      DatabaseDriverId.MariaDB,
    ];

    return sqlDrivers.includes(this.driver.id);
  }

  public async create<T>(collection: DbCollection, data: CreateData<T>) {
    const nData = this.toNamingStrategy(data);
    const nCollection = this.formatCollectionName(collection);

    const id = await this.driver.create(nCollection, nData);

    this.events.dispatch(new Event(
      DatabaseEvent.Created,
      `💾 Created new entry in \`${nCollection}\` collection.`,
      { id, collection: nCollection, data: nData },
    ));

    return id;
  }

  public async read<T>(collection: DbCollection, filter: Filter<T>, select?: Select<T>) {
    const nFilter = this.toNamingStrategy(filter);
    const nSelect = select ? this.toNamingStrategy(select) : undefined;
    const nCollection = this.formatCollectionName(collection);

    const data = await this.driver.read(nCollection, nFilter, nSelect);

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
    const nCollection = this.formatCollectionName(collection);

    const affectedItems = await this.driver.update(nCollection, nFilter, nData);

    this.events.dispatch(new Event(
      DatabaseEvent.Updated,
      `💾 Updated ${affectedItems} items in \`${nCollection}\` collection.`,
      { collection: nCollection, filter: nFilter, data: nData },
    ));

    return affectedItems;
  }

  public async delete<T>(collection: DbCollection, filter: Filter<T>) {
    const nFilter = this.toNamingStrategy(filter);
    const nCollection = this.formatCollectionName(collection);

    const affectedItems = await this.driver.delete(nCollection, nFilter);

    this.events.dispatch(new Event(
      DatabaseEvent.Deleted,
      `💾 Deleted ${affectedItems} items in \`${nCollection}\` collection.`,
      { collection: nCollection, filter: nFilter },
    ));

    return affectedItems;
  }

  public async dropCollection(collection: DbCollection) {
    await this.driver.dropCollection(this.formatCollectionName(collection));
  }

  public async quit() {
    if (!this.driver.quit) { return; }
    await this.driver.quit();
  }

  public formatCollectionName(collection: DbCollection) {
    const name = (this.collectionPrefix.length > 0)
      ? `${this.collectionPrefix}${collection.charAt(0).toUpperCase()}${collection.slice(1)}`
      : collection;

    return this.toNamingStrategy(name);
  }

  public fromNamingStrategy(input: string | Record<string, any>) {
    return fromNamingStrategy(input, this.namingStrategy);
  }

  public toNamingStrategy(input: string | Record<string, any>) {
    return toNamingStrategy(input, this.namingStrategy);
  }
}
