import { DbCollection } from './DbCollection';
import { DatabaseDriver as Driver } from './DatabaseConfig';
import { NamingStrategy } from './NamingStrategy';
import { Dispatcher } from '../events/Dispatcher';

export type CreateData<T = any> = { [R in keyof T]: T[R] };
export type UpdateData<T = any> = { [R in keyof T]?: T[R] };
export type Filter<T = any> = { [R in keyof T]?: T[R] };
export type Select<T = any, R extends keyof T = keyof T> = R[];

export interface Database<ConfigType = any> {
  driver: Driver;
  namingStrategy: NamingStrategy
  quit(): Promise<void>
  create<T>(collection: DbCollection, data: CreateData<T>): Promise<number>
  read<T>(collection: DbCollection, filter: Filter<T>, select?: Select<T>): Promise<T[]>
  update<T>(collection: DbCollection, filter: Filter<T>, data: UpdateData<T>): Promise<number>
  delete<T>(collection: DbCollection, filter: Filter<T>): Promise<number>
  setConfig(config: ConfigType): void
}

export interface DatabaseConstructor {
  new(events: Dispatcher, namingStrategy: NamingStrategy): Database
}

export type DatabaseFactory = (driver: Driver) => Database;
