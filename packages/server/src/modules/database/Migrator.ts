import { existsSync, readdirSync } from 'fs';
import { inject, injectable } from 'tsyringe';
import { Migration } from './Migration';
import { Database } from './Database';
import { DIToken } from '../../DIToken';
import { DbCollection } from './DbCollection';
import { RuntimeError } from '../../support/errors';
import { DatabaseError } from './DatabaseError';
import { Module } from '../Module';

@injectable()
export class Migrator {
  public readonly migrations: Migration<any>[] = [];

  constructor(@inject(DIToken.Database) private readonly database: Database) {
    this.buildMigrations();
  }

  private buildMigrations() {
    const migrationsDir = `${__dirname}/migrations/${this.database.driver.id}`;

    if (existsSync(migrationsDir)) {
      readdirSync(migrationsDir).forEach((file) => {
        // eslint-disable-next-line import/no-dynamic-require
        const migration = require(`${migrationsDir}/${file}`);
        this.migrations.push(migration.default || migration);
      });
    }

    this.migrations.unshift({
      up: async () => {
        // no-op
      },

      down: async () => {
        await Promise.all(Object.values(DbCollection).map((c) => this.database.dropCollection(c)));
      },
    });
  }

  public async up() {
    try {
      await Promise.all(
        this.migrations.map((migration) => migration.up(this.database)),
      );
    } catch (err) {
      throw new RuntimeError(
        DatabaseError.MigrationFailed,
        'Failed to run `up` migrations.',
        Module.Database,
        err,
      );
    }
  }

  public async down() {
    try {
      await Promise.all(
        this.migrations.reverse().map((migration) => migration.down(this.database)),
      );
    } catch (err) {
      throw new RuntimeError(
        DatabaseError.MigrationFailed,
        'Failed to run `down` migrations.',
        Module.Database,
        err,
      );
    }
  }
}
