import { AsyncContainerModule } from 'inversify';
import { DIToken } from '../../DIToken';
import { Config, Env } from '../../Config';
import { Module } from '../Module';
import {
  Mailer, MailerConstructor, MailSenderFactory, MailTransporter,
} from './Mailer';
import { Mailgun, SendGrid, Smtp } from './transporters';
import {
  createSmtpTestAccount, createSmtpTransport, SmtpClient, SmtpClientProvider,
} from './SmtpClient';
import { MailErrorCode, MailError } from './MailError';
import { FakeSmtpClient } from './FakeSmtpClient';
import { FakeMailer } from './FakeMailer';

export const MailModule = new AsyncContainerModule(async (bind) => {
  bind<SmtpClient>(DIToken.FakeSmtpClient)
    .toDynamicValue(() => new FakeSmtpClient())
    .inSingletonScope();

  bind<SmtpClientProvider>(DIToken.SmtpClientProvider).toProvider<SmtpClient>(
    ({ container }) => async () => {
      const config = container.get<Config>(DIToken.Config);

      if (config?.env === Env.Testing) {
        return container.get(DIToken.FakeSmtpClient);
      }

      const mailConfig = config?.[Module.Mail] || {};
      let smtpConfig = mailConfig!.smtp;

      if (config?.env === Env.Production && !smtpConfig) {
        throw MailError[MailErrorCode.MissingSmtpConfig]();
      } else {
        const testAccount = await createSmtpTestAccount();

        smtpConfig = {
          host: 'smtp.ethereal.email',
          port: 587,
          username: testAccount.username,
          password: testAccount.password,
        };

        mailConfig.smtp = smtpConfig;
        mailConfig.from = { name: testAccount.senderName, address: testAccount.senderAddress };
        config[Module.Mail] = mailConfig;
      }

      return createSmtpTransport(smtpConfig!);
    },
  );

  bind<MailSenderFactory>(DIToken.MailSenderFactory).toFactory<string>(({ container }) => {
    const config = container.get<Config>(DIToken.Config);

    return () => {
      const mailConfig = config?.[Module.Mail];

      // @TODO: find suitable defaults.
      if (!mailConfig?.from) { throw MailError[MailErrorCode.MissingFromConfig](); }

      return `${mailConfig?.from?.name} <${mailConfig?.from?.address}>`;
    };
  });

  bind<Mailer>(DIToken.FakeMailer)
    .toDynamicValue(() => new FakeMailer())
    .inSingletonScope();

  bind<Mailer>(DIToken.Mailer)
    .toDynamicValue(({ container }) => {
      const config = container.get<Config>(DIToken.Config);

      if (config?.env === Env.Testing) {
        return container.get(DIToken.FakeMailer);
      }

      const transporters: Record<MailTransporter, MailerConstructor> = {
        [MailTransporter.Smtp]: Smtp,
        [MailTransporter.Mailgun]: Mailgun,
        [MailTransporter.SendGird]: SendGrid,
      };

      const transporter = config?.[Module.Mail]?.transporter ?? MailTransporter.Smtp;
      return container.resolve<Mailer>(transporters[transporter]);
    }).inSingletonScope();
});
