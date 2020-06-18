import { Module } from '../Module';
import { App } from '../../App';
import {
  createSmtpTransport, FakeSmtpClient,
  Mailgun,
  SendGrid,
  Smtp,
  SmtpClient,
  SmtpClientFactory, SmtpConfig,
} from './transporters';
import { DIToken } from '../../DIToken';
import {
  Mailer, MailerConstructor, MailTransporterFactory,
} from './Mailer';
import { FakeMailer } from './FakeMailer';
import { MailConfig } from './MailConfig';
import { ModuleProvider } from '../../support/ModuleProvider';
import { MailError } from './MailError';
import { MailTransporter } from './Mail';

export const MailModule: ModuleProvider<MailConfig> = {
  module: Module.Mail,

  defaults: (app: App) => ({
    transporter: MailTransporter.Smtp,
    sandbox: app.isDevelopmentEnv,
    allowSandboxInProduction: false,
    // @TODO: insert app name and domain here.
    from: {
      name: 'Test App',
      address: 'no-reply@localhost.com',
    },
  }),

  configValidation: (app: App) => {
    const mailConfig = app.getConfig(Module.Mail)!;
    const transporter = mailConfig.transporter!;
    const isSmtpTransport = transporter === MailTransporter.Smtp;

    if (app.isProductionEnv && !mailConfig.allowSandboxInProduction && mailConfig.sandbox) {
      return {
        code: MailError.SandboxEnabledInProduction,
        message: 'Sandbox mode has been enabled in production, if you want to allow this then set '
          + '`config.mail.allowSandboxInProduction` to `true`',
        path: 'sandbox',
      };
    }

    if (!isSmtpTransport && !app.configPathExists(Module.Mail, transporter)) {
      return {
        code: MailError.MissingTransporterConfig,
        message: `The mail transporter [${transporter}] was selected but no configuration was found.`,
        path: transporter,
      };
    }

    if (!app.isTestingEnv && isSmtpTransport && !mailConfig.sandbox && !mailConfig[transporter]) {
      return {
        code: MailError.MissingSmtpConfig,
        message: 'Sandbox mode has been disabled and no SMTP configuration was found.',
        path: MailTransporter.Smtp,
      };
    }

    if (app.isProductionEnv && mailConfig.from!.address.includes('localhost')) {
      return {
        code: MailError.MissingMailFrom,
        message: 'Mail cannot be sent without the from field being set.',
        path: 'from',
      };
    }

    return undefined;
  },

  dependencies: (app: App) => {
    const { transporter } = app.getConfig(Module.Mail)!;
    return (transporter === MailTransporter.Smtp) ? ['nodemailer'] : [];
  },

  register: (app: App) => {
    const mailConfig = app.getConfig(Module.Mail)!;

    app
      .bind<SmtpClientFactory>(DIToken.SmtpClientFactory)
      .toFactory<SmtpClient>(() => (config: SmtpConfig) => createSmtpTransport(config));

    app
      .bind<MailTransporterFactory>(DIToken.MailTransporterFactory)
      .toFactory<Mailer<any>>(() => (transporter: MailTransporter) => {
      const transporters: Record<MailTransporter, MailerConstructor> = {
        [MailTransporter.Smtp]: Smtp,
        [MailTransporter.Mailgun]: Mailgun,
        [MailTransporter.SendGird]: SendGrid,
      };

      const mailer = app.resolve<Mailer<any>>(transporters[transporter]);
      mailer.useSandbox(mailConfig.sandbox!);
      mailer.setConfig(mailConfig[transporter]);
      mailer.setSender(`${mailConfig.from!.name} <${mailConfig.from!.address}>`);

      return mailer;
    });

    app
      .bind<Mailer<any>>(DIToken.Mailer)
      .toDynamicValue(() => app
        .get<MailTransporterFactory>(DIToken.MailTransporterFactory)(mailConfig!.transporter!))
      .inSingletonScope();
  },

  registerTestingEnv: (app: App) => {
    app.bind<FakeSmtpClient>(DIToken.FakeSmtpClient).toConstantValue(new FakeSmtpClient());

    app
      .rebind<SmtpClientFactory>(DIToken.SmtpClientFactory)
      .toConstantValue(() => app.get(DIToken.FakeSmtpClient));

    app.bind<Mailer<any>>(DIToken.FakeMailer).toConstantValue(new FakeMailer());
    app.rebind<Mailer<any>>(DIToken.Mailer).toConstantValue(app.get(DIToken.FakeMailer));
  },
};
