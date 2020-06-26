import { Module } from '../Module';
import { App } from '../../App';
import {
  createSmtpTransport,
  FakeSmtpClient,
  Mailgun,
  SendGrid,
  Smtp,
  SmtpClientFactory, SmtpConfig,
  MailerTransporterConstructor,
  MailTransporter,
  MailTransporterFactory,
  MailTransporterId,
  FakeMailTransporter,
} from './transporters';
import { DIToken } from '../../DIToken';
import { Mailer } from './Mailer';
import { MailConfig } from './MailConfig';
import { ModuleProvider } from '../../support/ModuleProvider';
import { MailError } from './MailError';

export class MailModule implements ModuleProvider<MailConfig> {
  public static id = Module.Mail;

  public static defaults(app: App) {
    return {
      transporter: MailTransporterId.Smtp,
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
    const isSmtpTransport = transporter === MailTransporterId.Smtp;

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
        path: MailTransporterId.Smtp,
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
    return (transporter === MailTransporterId.Smtp) ? ['nodemailer'] : [];
  }

  public register() {
    this.app.bindFactory<SmtpClientFactory>(
      DIToken.SmtpClientFactory,
      (config: SmtpConfig) => createSmtpTransport(config),
    );

    this.app.bindFactory<MailTransporterFactory>(
      DIToken.MailTransporterFactory,
      (id: MailTransporterId) => {
        const transporters: Record<MailTransporterId, MailerTransporterConstructor> = {
          [MailTransporterId.Smtp]: Smtp,
          [MailTransporterId.Mailgun]: Mailgun,
          [MailTransporterId.SendGird]: SendGrid,
        };

        return this.app.get<MailTransporter>(transporters[id]);
      },
    );

    this.app.bindBuilder<() => MailTransporter>(DIToken.MailTransporter, () => {
      const transporter = this.app.get<MailTransporterFactory>(
        DIToken.MailTransporterFactory,
      )(this.config.transporter!);

      transporter.sandbox = this.config.sandbox!;
      transporter.config = this.config[this.config.transporter!];
      transporter.sender = `${this.config.from!.name} <${this.config.from!.address}>`;

      return transporter;
    });

    this.app.bindClass(DIToken.Mailer, Mailer);
  }

  public registerTestingEnv() {
    this.app.bindValue<FakeSmtpClient>(DIToken.FakeSmtpClient, new FakeSmtpClient());
    this.app.bindFactory<SmtpClientFactory>(
      DIToken.SmtpClientFactory,
      () => this.app.get(DIToken.FakeSmtpClient),
    );

    this.app.bindValue<MailTransporter>(DIToken.FakeMailerTransporter, new FakeMailTransporter());
    this.app.bindValue<MailTransporter>(
      DIToken.MailTransporter,
      this.app.get(DIToken.FakeMailerTransporter),
    );
  }
}
