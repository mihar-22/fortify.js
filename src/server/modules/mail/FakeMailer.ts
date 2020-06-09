import { injectable } from 'inversify';
import { Mailer } from './Mailer';

@injectable()
export class FakeMailer implements Mailer {
  public send = jest.fn();
}
