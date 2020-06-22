import { injectable } from 'inversify';
import { Dispatcher } from '../../events/Dispatcher';
import { Mailer } from '../Mailer';
import { MailEvent, MailEventDispatcher } from '../MailEvent';
import { MailTemplateRenderer } from '../MailTemplateRenderer';
import { Event } from '../../events/Event';
import { Mail, MailResponse } from '../Mail';

@injectable()
export abstract class AbstractMailTransporter<
  ConfigType,
  ResponseType extends MailResponse
> implements Mailer<ConfigType> {
  protected config?: ConfigType;

  protected sender?: string;

  protected sandbox?: boolean;

  protected readonly events: MailEventDispatcher<any, ResponseType>;

  protected constructor(events: Dispatcher) {
    this.events = events;
  }

  abstract async sendMail(mail: Mail<any>, html?: string): Promise<ResponseType>;

  public setConfig(config: ConfigType) {
    this.config = config;
  }

  public setSender(sender: string) {
    this.sender = sender;
  }

  public useSandbox(sandbox: boolean) {
    this.sandbox = sandbox;
  }

  public async send(mail: Mail<any>): Promise<ResponseType> {
    const html = mail.template
      ? (await MailTemplateRenderer.render(mail.template, mail.data))
      : undefined;

    this.events.dispatch(new Event(
      MailEvent.Sending,
      `[${mail.subject}] -> SENDING -> [${mail.to}]`,
      { mail },
    ));

    const response = await this.sendMail(mail, html);

    if (response.success) {
      this.events.dispatch(new Event(
        MailEvent.Sent,
        `[${mail.subject}] -> SENT -> [${mail.to}]`,
        { mail, response },
      ));
    } else {
      this.events.dispatch(new Event(
        MailEvent.Failed,
        `[${mail.subject}] -> FAILED X [${mail.to}]`,
        { mail, response },
      ));
    }

    return response;
  }
}
