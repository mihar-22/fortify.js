import { DbCollection } from './DbCollection';
import { DatabaseDriver as Driver } from './DatabaseConfig';
import { NamingStrategy } from './NamingStrategy';
import { Dispatcher } from '../events/Dispatcher';

export interface Database<ConfigType = any> {
  driver: Driver;
  namingStrategy: NamingStrategy
  connect(): Promise<void>
  disconnect(): Promise<void>
  create(collection: DbCollection, data: object): Promise<string | number>
  read<T>(collection: DbCollection, filter: object, select?: object): Promise<T | undefined>
  update(collection: DbCollection, filter: object, data: object): Promise<void>
  delete(collection: DbCollection, filter: object): Promise<void>
  runTransaction(cb: () => Promise<void>): Promise<void>
  setConfig(config: ConfigType): void
}

export interface DatabaseConstructor {
  new(events: Dispatcher, namingStrategy: NamingStrategy): Database
}

export type DatabaseFactory = (driver: Driver) => Database;
