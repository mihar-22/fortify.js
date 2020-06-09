import { injectable } from 'inversify';
import { Dispatcher } from './Dispatcher';

@injectable()
export class FakeDispatcher implements Dispatcher {
  public dispatch = jest.fn();

  public flush = jest.fn();

  public forgetPushed = jest.fn();

  public listen = jest.fn();

  public push = jest.fn();
}
