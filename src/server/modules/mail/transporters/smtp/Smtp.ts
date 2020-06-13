import { inject, injectable } from 'inversify';
import { Mail, MailSenderFactory } from '../../Mailer';
import { DIToken } from '../../../../DIToken';
import { getPreviewUrl, SmtpClientProvider, SmtpResponse } from './SmtpClient';
import { AbstractMailTransporter } from '../AbstractMailTransporter';
import { Dispatcher } from '../../../events/Dispatcher';
import { MailEvent, MailEventCode } from '../../MailEvent';

@injectable()
export class Smtp extends AbstractMailTransporter<SmtpResponse> {
  protected readonly clientProvider: SmtpClientProvider;

  constructor(
  @inject(DIToken.SmtpClientProvider) clientProvider: SmtpClientProvider,
    @inject(DIToken.EventDispatcher) events: Dispatcher,
    @inject(DIToken.MailSenderFactory) sender: MailSenderFactory,
  ) {
    super(events, sender);
    this.clientProvider = clientProvider;
  }

  public async sendMail(mail: Mail<any>, html?: string): Promise<SmtpResponse> {
    const client = await this.clientProvider();

    const response = await client.sendMail({
      from: this.sender(),
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      html,
    });

    const previewUrl = getPreviewUrl(response);

    if (previewUrl) {
      const previewCreatedEvent = MailEvent[MailEventCode.MailPreviewCreated];
      this.events.dispatch(previewCreatedEvent(({ previewUrl, mail })));
    }

    return response;
  }
}
