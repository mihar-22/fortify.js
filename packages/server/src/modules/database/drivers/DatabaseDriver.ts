export type CreateData<T = any> = { [R in keyof T]: T[R] };
export type UpdateData<T = any> = { [R in keyof T]?: T[R] };
export type Filter<T = any> = { [R in keyof T]?: T[R] };
export type Select<T = any, R extends keyof T = keyof T> = R[];

export enum DatabaseDriverId {
  Memory = 'memory',
  MongoDB = 'mongo',
  MySQL = 'mysql',
  MySQL2 = 'mysql2',
  MariaDB = 'mariadb',
  Postgres = 'postgres',
  SQLite = 'sqlite',
  OracleDB = 'oracledb',
  MSSQL = 'mssql'
}

export interface DatabaseDriver<ConfigType = any> {
  id?: DatabaseDriverId
  config?: ConfigType
  quit?(): Promise<void>
  create(collection: string, data: CreateData): Promise<number>
  read(collection: string, filter: Filter, select?: Select): Promise<any[]>
  update(collection: string, filter: Filter, data: UpdateData): Promise<number>
  delete(collection: string, filter: Filter): Promise<number>
  dropCollection(collection: string): Promise<void>
}

export interface DatabaseDriverConstructor {
  new(...args: any[]): DatabaseDriver
}

export type DatabaseDriverFactory = (id: DatabaseDriverId) => DatabaseDriver;
