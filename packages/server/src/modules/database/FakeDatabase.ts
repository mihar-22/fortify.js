import { Database } from './Database';
import { NamingStrategy } from './NamingStrategy';
import { DatabaseDriver } from './DatabaseConfig';

export class FakeDatabase implements Database {
  public driver = DatabaseDriver.Memory;

  constructor(public namingStrategy: NamingStrategy) {}

  public quit = jest.fn();

  public create = jest.fn();

  public read = jest.fn();

  public update = jest.fn();

  public delete = jest.fn();

  public setConfig = jest.fn();
}
