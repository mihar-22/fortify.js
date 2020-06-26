import { DatabaseDriver, DatabaseDriverId } from './DatabaseDriver';

export class FakeDatabaseDriver implements DatabaseDriver {
  public id = DatabaseDriverId.Memory;

  public config?: any;

  public quit = jest.fn();

  public create = jest.fn();

  public read= jest.fn();

  public update = jest.fn();

  public delete = jest.fn();

  public dropCollection = jest.fn();
}
