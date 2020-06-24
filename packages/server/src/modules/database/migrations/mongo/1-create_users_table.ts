import { Migration } from '../../Migration';
import { MongoDB } from '../../drivers';

module.exports = {
  async up(database: MongoDB) {
    // change case.
  },

  async down(database: MongoDB) {
    // change case.
  },
} as Migration<MongoDB>;
