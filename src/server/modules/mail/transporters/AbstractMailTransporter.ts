import { injectable } from 'inversify';
import { Dispatcher } from '../../events/Dispatcher';
import { Mail, Mailer, MailSenderFactory } from '../Mailer';
import { MailEvent, MailEventCode } from '../MailEvent';
import { Logger } from '../../logger/Logger';
import { MailLog } from '../MailLog';

@injectable()
export abstract class AbstractMailTransporter<T> implements Mailer {
  protected readonly logger: Logger;

  protected readonly events: Dispatcher;

  protected readonly sender: MailSenderFactory;

  protected constructor(logger: Logger, events: Dispatcher, sender: MailSenderFactory) {
    this.logger = logger;
    this.events = events;
    this.sender = sender;
  }

  abstract async sendMail(mail: Mail<any>): Promise<T>;

  public async send(mail: Mail<any>): Promise<T> {
    this.logger.debug(MailLog[MailEventCode.MailSending]({ mail }));
    this.events.dispatch(MailEvent[MailEventCode.MailSending]({ mail }));
    const response = await this.sendMail(mail);
    this.logger.debug(MailLog[MailEventCode.MailSent]({ mail, response }));
    this.events.dispatch(MailEvent[MailEventCode.MailSent]({ mail, response }));
    return response;
  }
}
