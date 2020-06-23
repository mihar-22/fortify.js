import { inject, injectable } from 'tsyringe';
import { DIToken } from '../../../../DIToken';
import {
  createSmtpTestAccount,
  getPreviewUrl,
  SmtpClient,
  SmtpClientFactory,
  SmtpConfig,
  SmtpResponse,
} from './SmtpClient';
import { AbstractMailTransporter } from '../AbstractMailTransporter';
import { Dispatcher } from '../../../events/Dispatcher';
import { MailEvent } from '../../MailEvent';
import { LogLevel } from '../../../logger/Logger';
import { Event } from '../../../events/Event';
import { Mail } from '../../Mail';

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

    try {
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
          MailEvent.Preview,
          `[${mail.subject}]: ${previewUrl}`,
          { previewUrl, mail },
          LogLevel.Info,
        ));
      }

      return { ...response, success: !!(response?.accepted?.length) };
    } catch (err) {
      return {
        message: 'Failed to send mail with SMTP.',
        success: false,
        errors: [err.message],
      };
    }
  }
}
