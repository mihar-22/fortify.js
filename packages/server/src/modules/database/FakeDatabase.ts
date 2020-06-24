import { Database } from './Database';
import { NamingStrategy } from './NamingStrategy';

export class FakeDatabase implements Database {
  public namingStrategy: NamingStrategy;

  constructor(namingStrategy: NamingStrategy) {
    this.namingStrategy = namingStrategy;
  }

  public connect = jest.fn();

  public disconnect = jest.fn();

  public create = jest.fn();

  public read = jest.fn();

  public update = jest.fn();

  public delete = jest.fn();

  public setConfig = jest.fn();

  public async runTransaction(cb: () => Promise<void>): Promise<void> {
    await cb();
  }
}
