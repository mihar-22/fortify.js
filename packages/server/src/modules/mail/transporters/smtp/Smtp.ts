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
import { Dispatcher } from '../../../events/Dispatcher';
import { MailEvent } from '../../MailEvent';
import { LogLevel } from '../../../logger/Logger';
import { Event } from '../../../events/Event';
import { Mail } from '../../Mail';
import { MailTransporter, MailTransporterId } from '../MailTransporter';

@injectable()
export class Smtp implements MailTransporter<SmtpConfig, SmtpResponse> {
  public id = MailTransporterId.Smtp;

  public config?: SmtpConfig;

  public sandbox = false;

  public sender = '';

  private client?: SmtpClient;

  constructor(
    @inject(DIToken.SmtpClientFactory) private readonly clientFactory: SmtpClientFactory,
    @inject(DIToken.EventDispatcher) private readonly events: Dispatcher,
  ) {}

  private async buildClient(): Promise<SmtpClient> {
    return this.sandbox ? this.buildSandboxClient() : this.clientFactory(this.config!);
  }

  private async buildSandboxClient(): Promise<SmtpClient> {
    const testAccount = await createSmtpTestAccount();

    return this.clientFactory({
      host: 'smtp.ethereal.email',
      port: 587,
      username: testAccount.username,
      password: testAccount.password,
    });
  }

  public async send(mail: Mail<any>, html?: string): Promise<SmtpResponse> {
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
          `📖 [${mail.subject}]: ${previewUrl}`,
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
