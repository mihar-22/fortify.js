import { readdirSync } from 'fs';
import { inject, injectable } from 'tsyringe';
import { Migration } from './Migration';
import { Database } from './Database';
import { DatabaseDriver } from './DatabaseConfig';
import { DIToken } from '../../DIToken';

@injectable()
export class Migrator {
  public readonly migrations: Migration<any>[] = [];

  constructor(@inject(DIToken.Database) public readonly database: Database) {
    this.readMigrations();
  }

  private readMigrations() {
    const driverDir = (this.database.driver === DatabaseDriver.MongoDB) ? 'mongo' : 'sql';
    const migrationsDir = `${__dirname}/migrations/${driverDir}`;

    readdirSync(migrationsDir).forEach((file) => {
      // eslint-disable-next-line import/no-dynamic-require
      this.migrations.push(require(`${migrationsDir}/${file}`));
    });
  }

  public async up() {
    await Promise.all(this.migrations.map((m) => m.up(this.database)));
  }

  down() {
  }
}
