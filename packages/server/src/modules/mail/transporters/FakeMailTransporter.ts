import { injectable } from 'tsyringe';
import { MailTransporter, MailTransporterId } from './MailTransporter';

@injectable()
export class FakeMailTransporter implements MailTransporter {
  public id = MailTransporterId.Smtp;

  public config?: any;

  public sandbox = false;

  public sender = '';

  public send = jest.fn();
}
