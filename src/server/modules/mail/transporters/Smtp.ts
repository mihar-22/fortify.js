import { inject, injectable } from 'inversify';
import { Mail, MailSenderFactory } from '../Mailer';
import { DIToken } from '../../../DIToken';
import { getPreviewUrl, SmtpClientProvider } from '../SmtpClient';
import { AbstractMailTransporter } from './AbstractMailTransporter';
import { Logger } from '../../logger/Logger';
import { Dispatcher } from '../../events/Dispatcher';
import { MailTemplateBuilder } from '../MailTemplateBuilder';
import { MailLog } from '../MailLog';
import { MailEventCode } from '../MailEvent';

@injectable()
export class Smtp extends AbstractMailTransporter<object> {
  protected readonly clientProvider: SmtpClientProvider;

  constructor(
  @inject(DIToken.SmtpClientProvider) clientProvider: SmtpClientProvider,
    @inject(DIToken.Logger) logger: Logger,
    @inject(DIToken.EventDispatcher) events: Dispatcher,
    @inject(DIToken.MailSenderFactory) sender: MailSenderFactory,
  ) {
    super(logger, events, sender);
    this.clientProvider = clientProvider;
  }

  public async sendMail(mail: Mail<any>): Promise<object> {
    const client = await this.clientProvider();

    const html = mail.template
      ? (await MailTemplateBuilder.build(mail.template, mail.data))
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
      this.logger.info(MailLog[MailEventCode.MailPreviewCreated]({ previewUrl, mail }));
    }

    return response;
  }
}
