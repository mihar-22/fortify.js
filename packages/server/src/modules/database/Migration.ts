import { Database } from './Database';

export interface Migration<DatabaseType extends Database> {
  up(database: DatabaseType): Promise<void>
  down(database: DatabaseType): Promise<void>
}
