import { MySQL } from './MySQL';
import { DatabaseDriverId } from './DatabaseDriver';

export class MariaDB extends MySQL {
  public id = DatabaseDriverId.MariaDB;
}
