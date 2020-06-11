import { injectable } from 'inversify';
import { Dispatcher } from '../../events/Dispatcher';
import { Mail, Mailer, MailSenderFactory } from '../Mailer';
import { MailEvent, MailEventCode } from '../MailEvent';

@injectable()
export abstract class AbstractMailTransporter<ResponseType> implements Mailer {
  protected readonly events: Dispatcher;

  protected readonly sender: MailSenderFactory;

  protected constructor(events: Dispatcher, sender: MailSenderFactory) {
    this.events = events;
    this.sender = sender;
  }

  abstract async sendMail(mail: Mail<any>): Promise<ResponseType>;

  public async send(mail: Mail<any>): Promise<ResponseType> {
    this.events.dispatch(MailEvent[MailEventCode.MailSending]({ mail }));
    const response = await this.sendMail(mail);
    this.events.dispatch(MailEvent[MailEventCode.MailSent]({ mail, response }));
    return response;
  }
}
