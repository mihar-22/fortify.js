import { Migrator } from '../Migrator';
import { bootstrap } from '../../../bootstrap';
import { coreModules } from '../../index';
import { DIToken } from '../../../DIToken';
import { Config } from '../../../Config';

describe('Database', () => {
  describe('Migrator', () => {
    let migrator: Migrator;

    const boot = (config?: Config) => {
      const app = bootstrap(coreModules, config);
      migrator = app.get(DIToken.Migrator);
    };

    test('', () => {
    });
  });
});
