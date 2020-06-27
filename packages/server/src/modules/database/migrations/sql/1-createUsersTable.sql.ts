import { Migration } from '../../Migration';
import { Knex } from '../../drivers';
import { DbCollection } from '../../DbCollection';

export default {
  async up(db) {
    const { schema } = db.driver.getBuilder();

    await schema.createTable(DbCollection.Users, (table) => {
      table.increments().primary();
    });
  },
} as Migration<Knex>;
