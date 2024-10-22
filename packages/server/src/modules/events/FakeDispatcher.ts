import { injectable } from 'tsyringe';
import { Dispatcher } from './Dispatcher';

@injectable()
export class FakeDispatcher implements Dispatcher {
  public dispatch = jest.fn();

  public flush = jest.fn();

  public forgetPushed = jest.fn();

  public listen = jest.fn();

  public listenTo = jest.fn();

  public listenToAll = jest.fn();

  public push = jest.fn();
}
