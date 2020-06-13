import { Module } from '../Module';
import { App } from '../../App';
import {
  createSmtpTestAccount,
  createSmtpTransport,
  FakeSmtpClient,
  Mailgun,
  SendGrid,
  Smtp,
  SmtpClient,
  SmtpClientProvider,
} from './transporters';
import { configToken, DIToken } from '../../DIToken';
import {
  Mailer, MailerConstructor, MailSenderFactory, MailTransporter, MailTransporterFactory,
} from './Mailer';
import { FakeMailer } from './FakeMailer';
import { MailConfig, MailConfigError, MailConfigErrorCode } from './MailConfig';
import { ModuleProvider } from '../../support/ModuleProvider';

export const MailModule: ModuleProvider<MailConfig> = {
  module: Module.Mail,

  defaults: () => ({
    transporter: MailTransporter.Smtp,
    // @TODO: insert app name and domain here.
    from: {
      name: 'Test App',
      address: 'no-reply@localhost.com',
    },
  }),

  configValidation: (app: App) => {
    const mailConfig = app.getConfig(Module.Mail);
    const transporter = mailConfig!.transporter!;

    if (app.isProductionEnv && !app.configPathExists(Module.Mail, transporter)) {
      return MailConfigError[MailConfigErrorCode.MissingTransporterConfig](transporter);
    }

    if (app.isProductionEnv && mailConfig!.from!.address.includes('localhost')) {
      return MailConfigError[MailConfigErrorCode.MissingMailFrom];
    }

    return undefined;
  },

  dependencies: (app: App) => {
    const transporter = app.getConfig(Module.Mail)?.transporter;
    return (transporter === MailTransporter.Smtp) ? ['nodemailer'] : [];
  },

  register: (app: App) => {
    const mailConfig = app.getConfig(Module.Mail);

    app
      .bind(configToken(mailConfig!.transporter!))
      .toConstantValue(mailConfig![mailConfig!.transporter!] ?? {});

    app
      .bind<SmtpClientProvider>(DIToken.SmtpClientProvider)
      .toProvider<SmtpClient>(() => async () => {
      const smtpConfig = mailConfig?.[MailTransporter.Smtp];
      if (!smtpConfig) {
        const testAccount = await createSmtpTestAccount();
        return createSmtpTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          username: testAccount.username,
          password: testAccount.password,
        });
      }
      return createSmtpTransport(smtpConfig);
    });

    app
      .bind<MailSenderFactory>(DIToken.MailSenderFactory)
      .toFactory<string>(() => () => `${mailConfig!.from!.name} <${mailConfig!.from!.address}>`);

    app
      .bind<MailTransporterFactory>(DIToken.MailTransporterFactory)
      .toFactory<Mailer>(() => (transporter: MailTransporter) => {
      const transporters: Record<MailTransporter, MailerConstructor> = {
        [MailTransporter.Smtp]: Smtp,
        [MailTransporter.Mailgun]: Mailgun,
        [MailTransporter.SendGird]: SendGrid,
      };

      return app.resolve<Mailer>(transporters[transporter]);
    });

    app
      .bind<Mailer>(DIToken.Mailer)
      .toDynamicValue(() => app
        .get<MailTransporterFactory>(DIToken.MailTransporterFactory)(mailConfig!.transporter!))
      .inSingletonScope();
  },

  registerTestingEnv: (app: App) => {
    app.bind<SmtpClient>(DIToken.FakeSmtpClient).toConstantValue(new FakeSmtpClient());
    app.bind<Mailer>(DIToken.FakeMailer).toConstantValue(new FakeMailer());

    app
      .rebind<SmtpClientProvider>(DIToken.SmtpClientProvider)
      .toConstantValue(() => Promise.resolve(app.get(DIToken.FakeSmtpClient)));

    app.rebind<Mailer>(DIToken.Mailer).toConstantValue(app.get(DIToken.FakeMailer));
  },
};
