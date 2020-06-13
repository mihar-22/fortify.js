import { injectable } from 'inversify';
import { Dispatcher } from '../../events/Dispatcher';
import { Mail, Mailer, MailSenderFactory } from '../Mailer';
import { MailEvent, MailEventCode } from '../MailEvent';
import { MailTemplateRenderer } from '../MailTemplateRenderer';

@injectable()
export abstract class AbstractMailTransporter<ResponseType> implements Mailer {
  protected readonly events: Dispatcher;

  protected readonly sender: MailSenderFactory;

  protected constructor(events: Dispatcher, sender: MailSenderFactory) {
    this.events = events;
    this.sender = sender;
  }

  abstract async sendMail(mail: Mail<any>, html?: string): Promise<ResponseType>;

  public async send(mail: Mail<any>): Promise<ResponseType> {
    const html = mail.template
      ? (await MailTemplateRenderer.render(mail.template, mail.data))
      : undefined;
    this.events.dispatch(MailEvent[MailEventCode.MailSending]({ mail }));
    const response = await this.sendMail(mail, html);
    this.events.dispatch(MailEvent[MailEventCode.MailSent]({ mail, response }));
    return response;
  }
}
