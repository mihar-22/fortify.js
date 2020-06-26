import { inject, injectable } from 'tsyringe';
import { Mail, MailResponse } from './Mail';
import { MailEvent, MailEventDispatcher } from './MailEvent';
import { renderMailTemplate } from './renderMailTemplate';
import { Event } from '../events/Event';
import { MailTransporter } from './transporters';
import { DIToken } from '../../DIToken';

@injectable()
export class Mailer<ResponseType extends MailResponse = any> {
  constructor(
    @inject(DIToken.MailTransporter) private transporter: MailTransporter<any, ResponseType>,
    @inject(DIToken.EventDispatcher) private events: MailEventDispatcher<any, ResponseType>,
  ) {}

  public async send(mail: Mail<any>): Promise<ResponseType> {
    const html = mail.template
      ? (await renderMailTemplate(mail.template, mail.data))
      : undefined;

    this.events.dispatch(new Event(
      MailEvent.Sending,
      `📨 [${mail.subject}] -> SENDING -> [${mail.to}]`,
      { mail },
    ));

    const response = await this.transporter.send(mail, html);

    if (response.success) {
      this.events.dispatch(new Event(
        MailEvent.Sent,
        `📬 [${mail.subject}] -> SENT -> [${mail.to}]`,
        { mail, response },
      ));
    } else {
      this.events.dispatch(new Event(
        MailEvent.Failed,
        `❌ [${mail.subject}] -> FAILED --X [${mail.to}]`,
        { mail, response },
      ));
    }

    return response;
  }
}
