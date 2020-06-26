import { DatabaseDriver } from './drivers';
import { Database } from './Database';

export interface Migration<DriverType extends DatabaseDriver = DatabaseDriver> {
  up?(database: Database<DriverType>): Promise<void>
  down?(database: Database<DriverType>): Promise<void>
}
