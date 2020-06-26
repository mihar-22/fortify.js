import { Migration } from '../../Migration';
import { AbstractSQLDriver } from '../../drivers';
import { Database } from '../../Database';
import { DbCollection } from '../../DbCollection';

export default {
  async up(database: Database<AbstractSQLDriver>) {
    const columns: Record<string, string> = {
      id: 'int AUTO_INCREMENT PRIMARY KEY',
    };

    const createTableStmt = database.driver.buildCreateTableQuery(
      database.formatCollectionName(DbCollection.Users),
      columns,
      database.namingStrategy,
    );

    await database.driver.runQuery(createTableStmt);
  },

  async down() {
    // no-op
  },
} as Migration<AbstractSQLDriver>;
