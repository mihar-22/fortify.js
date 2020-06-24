import { MySQL } from './MySQL';
import { DatabaseDriver } from '../DatabaseConfig';

export class MariaDB extends MySQL {
  public driver = DatabaseDriver.MariaDB;
}
