import { Migration } from '../../Migration';
import { Knex } from '../../drivers';

export default {
  async up(db) {
    const builder = db.driver.getBuilder();

    // here we build our table.
  },
} as Migration<Knex>;
