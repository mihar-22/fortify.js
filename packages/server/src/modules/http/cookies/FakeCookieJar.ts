import { injectable } from 'inversify';

@injectable()
export class FakeCookieJar {
  public make = jest.fn();

  public queue= jest.fn();

  public dequeue= jest.fn();

  public forget= jest.fn();

  public getQueued = jest.fn();

  public hasQueued = jest.fn();

  public attachTo = jest.fn();
}
