export enum DatabaseAdapter {
  MySQL = 'mysql',
  MariaDB = 'mariadb',
  Postgres = 'postgres',
  Sqlite = 'sqlite',
  Lowdb = 'lowdb',
  MongoDB = 'mongo',
}

export interface DatabaseConfig {
  adapter?: DatabaseAdapter
}
