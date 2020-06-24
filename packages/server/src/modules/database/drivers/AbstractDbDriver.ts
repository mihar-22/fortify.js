import { Database } from '../Database';
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

      await this.performConnect();

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

    await this.performDisconnect();

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

  public async create(collection: DbCollection, data: object) {
    const nData = this.toNamingStrategy(data);
    const id = await this.performCreate(collection, nData);
    this.events.dispatch(new Event(
      DatabaseEvent.Created,
      `💾 Created new entry in \`${collection}\` collection.`,
      { id, collection, data: nData },
    ));
    return id;
  }

  public async read<T>(collection: DbCollection, filter: object, select?: object) {
    const nFilter = this.toNamingStrategy(filter);
    const nSelect = select ? this.toNamingStrategy(select) : undefined;
    const data = await this.performRead<T>(collection, nFilter, nSelect);
    this.events.dispatch(new Event(
      DatabaseEvent.Read,
      `💾 Performed read on \`${collection}\` collection.`,
      {
        collection, filter: nFilter, select: nSelect, data,
      },
    ));
    return this.fromNamingStrategy(data);
  }

  public async update(collection: DbCollection, filter: object, data: object) {
    const nFilter = this.toNamingStrategy(filter);
    const nData = this.toNamingStrategy(data);
    await this.performUpdate(collection, nFilter, nData);
    this.events.dispatch(new Event(
      DatabaseEvent.Updated,
      `💾 Updated data in \`${collection}\` collection.`,
      { collection, filter: nFilter, data: nData },
    ));
  }

  public async delete(collection: DbCollection, filter: object) {
    const nFilter = this.toNamingStrategy(filter);
    await this.performDelete(collection, nFilter);
    this.events.dispatch(new Event(
      DatabaseEvent.Deleted,
      `💾 Deleted data in \`${collection}\` collection.`,
      { collection, filter: nFilter },
    ));
  }

  public setConfig(config: ConfigType) {
    this.config = config;
  }

  abstract driver: DatabaseDriver;

  abstract async runTransaction(cb: () => Promise<void>): Promise<void>;

  abstract async performConnect(): Promise<void>;

  abstract async performDisconnect(): Promise<void>;

  abstract async performCreate(
    collection: DbCollection,
    data: object
  ): Promise<string | number>;

  abstract async performRead<T>(
    collection: DbCollection,
    filter: object,
    select?: object
  ): Promise<T | undefined>;

  abstract async performUpdate(
    collection: DbCollection,
    filter: object,
    data: object
  ): Promise<void>;

  abstract async performDelete(
    collection: DbCollection,
    filter: object
  ): Promise<void>;
}
