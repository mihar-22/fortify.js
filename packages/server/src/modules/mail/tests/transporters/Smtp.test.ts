import { MailModule } from '../../MailModule';
import { DIToken } from '../../../../DIToken';
import { Config, Env } from '../../../../Config';
import { FakeSmtpClient, Smtp } from '../../transporters';
import { EventsModule } from '../../../events/EventsModule';
import { App } from '../../../../App';
import { bootstrap } from '../../../../bootstrap';
import { LoggerModule } from '../../../logger/LoggerModule';
import { MailTransporter } from '../../Mail';
import { MailTransporterFactory } from '../../Mailer';

describe('Mail', () => {
  describe('Transporters', () => {
    describe('Smtp', () => {
      let app: App;
      let mailer: Smtp;
      let smtpClient: FakeSmtpClient;

      const mailRecipient = 'john_doe@localhost.com';
      const mailSender = 'Test App <no-reply@localhost.com>';
      const template = require.resolve('../fixtures/dummy-template.html');

      const mail = {
        subject: 'Subject',
        to: mailRecipient,
        text: 'Fresh email.',
        template,
        data: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      const boot = async (config?: Config) => {
        app = await bootstrap([LoggerModule, EventsModule, MailModule], config, true);
        mailer = app.get<MailTransporterFactory>(
          DIToken.MailTransporterFactory,
        )(MailTransporter.Smtp) as Smtp;
      };

      beforeEach(async () => {
        await boot({ env: Env.Testing });
        smtpClient = await app.get<() => FakeSmtpClient>(DIToken.SmtpClientFactory)();
      });

      test('sends mail', async () => {
        smtpClient.sendMail.mockReturnValueOnce({});
        await mailer.sendMail(mail);
        expect(smtpClient.sendMail).toHaveBeenCalledWith({
          subject: mail.subject,
          to: mail.to,
          text: mail.text,
          from: mailSender,
        });
      });

      // test('sends mail e2e', async () => {
      //   mailer.useSandbox(true);
      //   await boot({ env: Env.Development });
      //   const response = await mailer.sendMail(mail);
      //   console.log(response);
      //   expect(response).toBeDefined();
      // });
    });
  });
});
