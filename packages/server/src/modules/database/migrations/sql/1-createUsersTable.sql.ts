import { Migration } from '../../Migration';
import { AbstractSQLDriver } from '../../drivers';
import { Database } from '../../Database';

export const createUsersTable: Migration<AbstractSQLDriver> = {
  async up(database: Database<AbstractSQLDriver>) {
    const query = database.driver.sql`
    CREATE TABLE users (
      id int NOT NULL AUTO_INCREMENT,
      PRIMARY KEY(id)
    );
    `;

    // how to:
    //  - table name
    //  - table prefix
    //  - naming strategy

    await database.driver.runQuery(query);
  },

  async down() {
    // no-op
  },
};

export default createUsersTable;
