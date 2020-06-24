import { Database } from './Database';
import { NamingStrategy } from './NamingStrategy';
import { DatabaseDriver } from './DatabaseConfig';

export class FakeDatabase implements Database {
  public driver = DatabaseDriver.Memory;

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
