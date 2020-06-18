import { injectable } from 'inversify';
import { Logger, LogLevel } from './Logger';

@injectable()
export class FakeLogger implements Logger {
  public level = LogLevel.Debug;

  public silent = jest.fn();

  public fatal = jest.fn();

  public error = jest.fn();

  public warn = jest.fn();

  public info = jest.fn();

  public debug = jest.fn();

  public trace = jest.fn();

  public addDefaultTransporter = jest.fn();
}
