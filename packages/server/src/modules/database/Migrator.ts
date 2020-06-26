import { existsSync, readdirSync } from 'fs';
import { inject, injectable } from 'tsyringe';
import { Migration } from './Migration';
import { Database } from './Database';
import { DIToken } from '../../DIToken';

@injectable()
export class Migrator {
  public readonly migrations: Migration<any>[] = [];

  constructor(@inject(DIToken.Database) private readonly database: Database) {
    this.readMigrations();
  }

  private readMigrations() {
    const driverDir = this.database.isSQLDriver ? 'sql' : this.database.driver.id;
    const migrationsDir = `${__dirname}/migrations/${driverDir}`;
    if (existsSync(migrationsDir)) {
      readdirSync(migrationsDir).forEach((file) => {
        // eslint-disable-next-line import/no-dynamic-require
        this.migrations.push(require(`${migrationsDir}/${file}`));
      });
    }
  }

  public async up() {
    await Promise.all(this.migrations.map((migration) => migration.up(this.database)));
  }

  public async down() {
    await Promise.all(this.migrations.map((migration) => migration.down(this.database)));
  }
}
