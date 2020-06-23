import { injectable } from 'tsyringe';
import { SmtpClient } from './SmtpClient';

@injectable()
export class FakeSmtpClient implements SmtpClient {
  public sendMail = jest.fn();
}
