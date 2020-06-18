import { injectable } from 'inversify';
import { Mailer } from './Mailer';

@injectable()
export class FakeMailer implements Mailer<any> {
  public send = jest.fn();

  public setConfig = jest.fn();

  public setSender = jest.fn();

  public useSandbox = jest.fn();
}
