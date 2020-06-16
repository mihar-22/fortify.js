import { inject, injectable } from 'inversify';
import { Mail } from '../../Mailer';
import { DIToken } from '../../../../DIToken';
import {
  createSmtpTestAccount,
  getPreviewUrl,
  SmtpClient,
  SmtpClientFactory,
  SmtpResponse,
} from './SmtpClient';
import { AbstractMailTransporter } from '../AbstractMailTransporter';
import { Dispatcher } from '../../../events/Dispatcher';
import { MailEvent } from '../../MailEvent';
import { SmtpConfig } from '../../MailConfig';
import { LogLevel } from '../../../logger/Logger';
import { Event } from '../../../events/Event';

@injectable()
export class Smtp extends AbstractMailTransporter<SmtpConfig, SmtpResponse> {
  protected client?: SmtpClient;

  protected readonly clientFactory: SmtpClientFactory;

  constructor(
  @inject(DIToken.SmtpClientFactory) clientFactory: SmtpClientFactory,
    @inject(DIToken.EventDispatcher) events: Dispatcher,
  ) {
    super(events);
    this.clientFactory = clientFactory;
  }

  private async buildSandboxClient() {
    const testAccount = await createSmtpTestAccount();

    return this.clientFactory({
      host: 'smtp.ethereal.email',
      port: 587,
      username: testAccount.username,
      password: testAccount.password,
    });
  }

  private async buildClient() {
    return this.sandbox ? this.buildSandboxClient() : this.clientFactory(this.config!);
  }

  public async sendMail(mail: Mail<any>, html?: string): Promise<SmtpResponse> {
    if (!this.client) { this.client = await this.buildClient(); }

    const response = await this.client!.sendMail({
      from: this.sender,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      html,
    });

    const previewUrl = getPreviewUrl(response);

    if (previewUrl) {
      this.events.dispatch(new Event(
        MailEvent.MailPreviewCreated,
        `Generated mail [${mail.subject}] preview: ${previewUrl}`,
        { previewUrl, mail },
        LogLevel.Info,
      ));
    }

    return response;
  }
}
