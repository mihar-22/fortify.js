import { Module } from '../Module';
import { App } from '../../App';
import {
  createSmtpTransport, FakeSmtpClient,
  Mailgun,
  SendGrid,
  Smtp,
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

export class MailModule implements ModuleProvider<MailConfig> {
  public static id = Module.Mail;

  public static defaults(app: App) {
    return {
      transporter: MailTransporter.Smtp,
      sandbox: app.isDevelopmentEnv,
      allowSandboxInProduction: false,
      // @TODO: insert app name and domain here.
      from: {
        name: 'Test App',
        address: 'no-reply@localhost.com',
      },
    };
  }

  constructor(
    private readonly app: App,
    private readonly config: MailConfig,
  ) {}

  public configValidation() {
    const transporter = this.config.transporter!;
    const isSmtpTransport = transporter === MailTransporter.Smtp;

    if (this.app.isProductionEnv && !this.config.allowSandboxInProduction && this.config.sandbox) {
      return {
        code: MailError.SandboxEnabledInProduction,
        message: 'Sandbox mode has been enabled in production, if you want to allow this then set '
          + '`config.mail.allowSandboxInProduction` to `true`',
        path: 'sandbox',
      };
    }

    if (!isSmtpTransport && !this.app.configPathExists(Module.Mail, transporter)) {
      return {
        code: MailError.MissingTransporterConfig,
        message: `The mail transporter [${transporter}] was selected but no configuration was found.`,
        path: transporter,
      };
    }

    if (
      !this.app.isTestingEnv
      && isSmtpTransport && !this.config.sandbox && !this.config[transporter]
    ) {
      return {
        code: MailError.MissingSmtpConfig,
        message: 'Sandbox mode has been disabled and no SMTP configuration was found.',
        path: MailTransporter.Smtp,
      };
    }

    if (this.app.isProductionEnv && this.config.from!.address.includes('localhost')) {
      return {
        code: MailError.MissingMailFrom,
        message: 'Mail cannot be sent without the from field being set.',
        path: 'from',
      };
    }

    return undefined;
  }

  public dependencies() {
    const { transporter } = this.app.getConfig(Module.Mail)!;
    return (transporter === MailTransporter.Smtp) ? ['nodemailer'] : [];
  }

  public register() {
    this.app.bindFactory<SmtpClientFactory>(
      DIToken.SmtpClientFactory,
      (config: SmtpConfig) => createSmtpTransport(config),
    );

    this.app.bindFactory<MailTransporterFactory>(
      DIToken.MailTransporterFactory,
      (transporter: MailTransporter) => {
        const transporters: Record<MailTransporter, MailerConstructor> = {
          [MailTransporter.Smtp]: Smtp,
          [MailTransporter.Mailgun]: Mailgun,
          [MailTransporter.SendGird]: SendGrid,
        };

        const mailer = this.app.get<Mailer<any>>(transporters[transporter]);
        mailer.useSandbox(this.config.sandbox!);
        mailer.setConfig(this.config[transporter]);
        mailer.setSender(`${this.config.from!.name} <${this.config.from!.address}>`);

        return mailer;
      },
    );

    this.app.bindBuilder<() => Mailer<any>>(DIToken.Mailer,
      () => this.app.get<MailTransporterFactory>(
        DIToken.MailTransporterFactory,
      )(this.config.transporter!));
  }

  public registerTestingEnv() {
    this.app.bindValue<FakeSmtpClient>(DIToken.FakeSmtpClient, new FakeSmtpClient());
    this.app.bindFactory<SmtpClientFactory>(
      DIToken.SmtpClientFactory,
      () => this.app.get(DIToken.FakeSmtpClient),
    );
    this.app.bindValue<Mailer<any>>(DIToken.FakeMailer, new FakeMailer());
    this.app.bindValue<Mailer<any>>(DIToken.Mailer, this.app.get(DIToken.FakeMailer));
  }
}
