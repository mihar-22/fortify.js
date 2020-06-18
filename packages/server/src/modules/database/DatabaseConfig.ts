export enum DatabaseType {
  MySQL = 'mysql',
  MariaDB = 'mariadb',
  Postgres = 'postgres',
  CockroachDB = 'cockroachdb',
  Sqlite = 'sqlite',
  MSSQL = 'mssql',
  SAP = 'sap',
  Oracle = 'oracle',
  Cordova = 'cordova',
  NativeScript = 'nativescript',
  ReactNative = 'react-native',
  SQLJS = 'sqljs',
  MongoDB = 'mongo',
  AuroraDataApi = 'aurora-data-api',
  AuroraDataApiPostgres = 'aurora-data-api-pg',
  Expo = 'expo'
}

export interface DatabaseConfig {
  connection?: {
    type?: DatabaseType,
    host?: string
    port?: number
    username?: string
    password?: string
    database?: string
  }
}
