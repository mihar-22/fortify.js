import { Migration } from '../../Migration';
import { MySQL } from '../../drivers';

module.exports = {
  async up(database: MySQL) {
    // change case.
  },

  async down(driver: MySQL) {
    // change case.
  },
} as Migration<MySQL>;
