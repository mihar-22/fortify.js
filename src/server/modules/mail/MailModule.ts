import { AsyncContainerModule } from 'inversify';
import DIToken from '../../DIToken';
import Config, { Env } from '../../Config';
import Module from '../Module';
import { MailDriver, Mailer } from './Mailer';
import Mailgun from './drivers/Mailgun';
import SendGrid from './drivers/SendGrid';
import {
  createSmtpTestAccount, createSmtpTransport, SmtpClient, SmtpProvider,
} from './SmtpClient';
import { MailError, MailErrorCode } from './MailError';

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
    const config = context.container.get<Config>(DIToken.Config);
    const driver = config?.[Module.Mail]?.driver ?? MailDriver.Smtp;

    let driverImpl: any;

    switch (driver) {
      case MailDriver.Smtp:
        driverImpl = Smtp;
        break;
      case MailDriver.MailGun:
        driverImpl = Mailgun;
        break;
      case MailDriver.SendGird:
        driverImpl = SendGrid;
        break;
    }
  });
});

export default MailModule;
