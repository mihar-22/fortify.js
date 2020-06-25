import { bootstrap } from '../../../../bootstrap';
import { coreModules } from '../../../index';
import { DIToken } from '../../../../DIToken';
import { DatabaseDriver } from '../../DatabaseConfig';
import { DatabaseFactory } from '../../Database';
import { DbCollection } from '../../DbCollection';
import { Env } from '../../../../Config';
import { Memory } from '../../drivers';

interface TestUser {
  id: number
  firstName: string
  lastName: string
}

describe('Database', () => {
  describe('Drivers', () => {
    describe('Memory', () => {
      let db: Memory;

      const users: TestUser[] = [{
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
      }, {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
      }];

      beforeEach(() => {
        const app = bootstrap(coreModules, { env: Env.Testing });
        db = app
          .get<DatabaseFactory>(DIToken.DatabaseDriverFactory)(DatabaseDriver.Memory) as Memory;
      });

      beforeEach(async () => users.map((user) => db.create(DbCollection.Users, user)));

      test('should create data in db and return id', async () => {
        const newUserId = await db.create(DbCollection.Users, users[0]);

        expect(newUserId).toBe(3);

        expect(db.getDb()).toEqual({
          [DbCollection.Users]: {
            1: users[0],
            2: users[1],
            [newUserId]: { ...users[0], id: newUserId },
          },
        });
      });

      test('should read in empty array', async () => {
        const items = await db.read(DbCollection.Users, { id: 5 });
        expect(items).toHaveLength(0);
      });

      test('should read in single item', async () => {
        const items = await db.read(DbCollection.Users, { id: 1 });
        expect(items).toHaveLength(1);
      });

      test('should read in multiple items', async () => {
        const items = await db.read(DbCollection.Users, { lastName: 'Doe' });
        expect(items).toHaveLength(2);
      });

      test('should return all fields if select is empty', async () => {
        const items = await db.read<TestUser>(DbCollection.Users, { lastName: 'Doe' }, []);
        expect(items).toEqual(users);
      });

      test('should return only selected fields', async () => {
        const items = await db.read<TestUser>(DbCollection.Users, { lastName: 'Doe' }, ['firstName']);
        expect(items).toEqual([{
          firstName: users[0].firstName,
        }, {
          firstName: users[1].firstName,
        }]);
      });

      test('should update item', async () => {
        const affectedItems = await db
          .update<TestUser>(DbCollection.Users, { id: 2 }, { lastName: 'New' });
        expect(affectedItems).toBe(1);
        expect(db.getDb()[DbCollection.Users][2].lastName).toBe('New');
      });

      test('should update multiple items', async () => {
        const affectedItems = await db
          .update<TestUser>(DbCollection.Users, { lastName: 'Doe' }, { firstName: 'New' });
        expect(affectedItems).toBe(2);
        expect(db.getDb()[DbCollection.Users][1].firstName).toBe('New');
        expect(db.getDb()[DbCollection.Users][2].firstName).toBe('New');
      });

      test('should delete item', async () => {
        const affectedItems = await db
          .delete<TestUser>(DbCollection.Users, { id: 1 });
        expect(affectedItems).toBe(1);
        expect(db.getDb()[DbCollection.Users][1]).toBeUndefined();
      });

      test('should delete multiple items', async () => {
        const affectedItems = await db
          .delete<TestUser>(DbCollection.Users, { lastName: 'Doe' });
        expect(affectedItems).toBe(2);
        expect(db.getDb()[DbCollection.Users][1]).toBeUndefined();
        expect(db.getDb()[DbCollection.Users][2]).toBeUndefined();
      });
    });
  });
});
