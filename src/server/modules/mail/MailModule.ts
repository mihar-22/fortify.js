import { AsyncContainerModule } from 'inversify';
import DIToken from '../../DIToken';
import Config, { Env } from '../../Config';
import Module from '../Module';
import { MailTransporter, Mailer, MailerConstructor } from './Mailer';
import Mailgun from './transporters/Mailgun';
import SendGrid from './transporters/SendGrid';
import {
  createSmtpTestAccount, createSmtpTransport, SmtpClient, SmtpProvider,
} from './SmtpClient';
import { MailError, MailErrorCode } from './MailError';
import Smtp from './transporters/Smtp';

const MailModule = new AsyncContainerModule(async (bind) => {
  bind<SmtpProvider>(DIToken.SmtpClientProvider).toProvider<SmtpClient>((context) => async () => {
    const config = context.container.get<Config>(DIToken.Config);
    let smtpConfig = config?.[Module.Mail]?.smtp;

    if (config?.env === Env.Production && !smtpConfig) {
      throw MailError[MailErrorCode.MissingSmtpConfig];
    } else {
      const testAccount = await createSmtpTestAccount();

      smtpConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        username: testAccount.username,
        password: testAccount.password,
        fromName: testAccount.senderName,
        fromAddress: testAccount.senderAddress,
      };
    }

    context.container.bind<string>(DIToken.MailSender)
      .toConstantValue(`${smtpConfig!.fromName} <${smtpConfig!.fromAddress}>`);

    return createSmtpTransport(smtpConfig!);
  });

  bind<Mailer>(DIToken.Mailer).toDynamicValue((context) => {
    const transporters: Record<MailTransporter, MailerConstructor> = {
      [MailTransporter.Smtp]: Smtp,
      [MailTransporter.Mailgun]: Mailgun,
      [MailTransporter.SendGird]: SendGrid,
    };

    const config = context.container.get<Config>(DIToken.Config);
    const transporter = config?.[Module.Mail]?.transporter ?? MailTransporter.Smtp;
    return context.container.resolve<Mailer>(transporters[transporter]);
  }).inSingletonScope();
});

export default MailModule;
