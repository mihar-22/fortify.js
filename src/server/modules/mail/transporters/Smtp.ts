import { inject, injectable } from 'inversify';
import { Mail, MailSenderFactory } from '../Mailer';
import { DIToken } from '../../../DIToken';
import { getPreviewUrl, SmtpClientProvider } from '../SmtpClient';
import { AbstractMailTransporter } from './AbstractMailTransporter';
import { Logger } from '../../logger';
import { Dispatcher } from '../../events';
import { MailTemplateBuilder } from '../MailTemplateBuilder';
import { Module } from '../../Module';

@injectable()
export class Smtp extends AbstractMailTransporter {
  private readonly clientProvider: SmtpClientProvider;

  constructor(
  @inject(DIToken.SmtpClientProvider) clientProvider: SmtpClientProvider,
    @inject(DIToken.Logger) logger: Logger,
    @inject(DIToken.EventDispatcher) events: Dispatcher,
    @inject(DIToken.MailSenderFactory) sender: MailSenderFactory,
  ) {
    super(logger, events, sender);
    this.clientProvider = clientProvider;
  }

  public async sendMail<T extends object>(mail: Mail<T>): Promise<any> {
    const client = await this.clientProvider();

    const html = mail.template
      ? (await MailTemplateBuilder.build<T>(mail.template, mail.data))
      : undefined;

    const response = await client.sendMail({
      from: this.sender(),
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      html,
    });

    const previewUrl = getPreviewUrl(response);

    if (previewUrl) {
      this.logger.info({
        label: Module.Mail,
        action: `Preview URL: ${previewUrl}`,
        context: { mail, response },
      });
    }

    return response;
  }
}
