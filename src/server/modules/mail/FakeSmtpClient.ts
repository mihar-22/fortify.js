import { injectable } from 'inversify';
import { SmtpClient } from './SmtpClient';

@injectable()
export class FakeSmtpClient implements SmtpClient {
  public sendMail = jest.fn();
}
