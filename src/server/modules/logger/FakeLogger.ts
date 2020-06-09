import { injectable } from 'inversify';
import { Logger } from './Logger';

@injectable()
export class FakeLogger implements Logger {
  public transports = [];

  public silent = false;

  public error = jest.fn();

  public warn = jest.fn();

  public help = jest.fn();

  public data = jest.fn();

  public info = jest.fn();

  public debug = jest.fn();

  public prompt = jest.fn();

  public http = jest.fn();

  public verbose = jest.fn();

  public input = jest.fn();

  public silly = jest.fn();

  public emerg = jest.fn();

  public alert = jest.fn();

  public crit = jest.fn();

  public warning = jest.fn();

  public notice = jest.fn();

  public log = jest.fn();

  public add = jest.fn();

  public remove = jest.fn();

  public clear = jest.fn();

  public close = jest.fn();
}
