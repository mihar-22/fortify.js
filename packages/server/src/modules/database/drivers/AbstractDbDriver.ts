import {
  CreateData,
  Database, Filter, Select, UpdateData,
} from '../Database';
import { NamingStrategy } from '../NamingStrategy';
import { DbCollection } from '../DbCollection';
import { Dispatcher } from '../../events/Dispatcher';
import { Event } from '../../events/Event';
import { DatabaseEvent, DatabaseEventDispatcher } from '../DatabaseEvent';
import { RuntimeError } from '../../../support/errors';
import { DatabaseError } from '../DatabaseError';
import { Module } from '../../Module';
import { camelToSnakeCase, snakeToCamelCase } from '../../../utils/string';
import { DatabaseDriver } from '../DatabaseConfig';

export abstract class AbstractDbDriver<ConfigType> implements Database<ConfigType> {
  public events: DatabaseEventDispatcher;

  public config?: ConfigType;

  public namingStrategy: NamingStrategy;

  constructor(events: Dispatcher, namingStrategy: NamingStrategy) {
    this.events = events;
    this.namingStrategy = namingStrategy;
  }

  public async connect() {
    try {
      this.events.dispatch(new Event(
        DatabaseEvent.Connecting,
        '🔌 Connecting...',
        undefined,
      ));

      await this.driverConnect();

      this.events.dispatch(new Event(
        DatabaseEvent.Connected,
        '🔗 Connected!',
        undefined,
      ));
    } catch (e) {
      this.events.dispatch(new Event(
        DatabaseEvent.ConnectionFailed,
        '❌ Failed to connect!',
        e,
      ));

      throw new RuntimeError(
        DatabaseError.ConnectionFailed,
        `Failed to connect to the database: ${e.message}`,
        Module.Database,
        e,
        [
          'Bad connection configuration.',
          'Database doesn\'t exist.',
        ],
      );
    }
  }

  public async disconnect() {
    this.events.dispatch(new Event(
      DatabaseEvent.Disconnecting,
      '🔗 Disconnecting...',
      undefined,
    ));

    await this.driverDisconnect();

    this.events.dispatch(new Event(
      DatabaseEvent.Disconnected,
      '🔌 Disconnected!',
      undefined,
    ));
  }

  private toNamingStrategy = (obj: any) => {
    if (this.namingStrategy !== NamingStrategy.SnakeCase) { return obj; }

    const clone: any = {};

    Object.keys(obj).forEach((key) => {
      clone[camelToSnakeCase(key)] = obj[key];
    });

    return clone;
  };

  private fromNamingStrategy = (obj: any) => {
    if (this.namingStrategy !== NamingStrategy.SnakeCase) { return obj; }

    const clone: any = {};

    Object.keys(obj).forEach((key) => {
      clone[snakeToCamelCase(key)] = obj[key];
    });

    return clone;
  };

  public async create<T>(collection: DbCollection, data: CreateData<T>) {
    const nData = this.toNamingStrategy(data);
    const nCollection = this.toNamingStrategy(collection);

    const id = await this.driverCreate(nCollection, nData);

    this.events.dispatch(new Event(
      DatabaseEvent.Create,
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
      DatabaseEvent.Update,
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
      DatabaseEvent.Delete,
      `💾 Deleted ${affectedItems} items in \`${nCollection}\` collection.`,
      { collection: nCollection, filter: nFilter },
    ));

    return affectedItems;
  }

  public setConfig(config: ConfigType) {
    this.config = config;
  }

  abstract driver: DatabaseDriver;

  abstract async runTransaction(cb: () => Promise<void>): Promise<void>;

  abstract async driverConnect(): Promise<void>;

  abstract async driverDisconnect(): Promise<void>;

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
