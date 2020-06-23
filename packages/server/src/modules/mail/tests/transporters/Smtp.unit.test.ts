import { DIToken } from '../../../../DIToken';
import { Config, Env } from '../../../../Config';
import { FakeSmtpClient, Smtp } from '../../transporters';
import { App } from '../../../../App';
import { bootstrap } from '../../../../bootstrap';
import { MailTransporter } from '../../Mail';
import { MailTransporterFactory } from '../../Mailer';
import { coreModules } from '../../../index';

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

      const boot = (config?: Config) => {
        app = bootstrap(coreModules, config, true);
        mailer = app.get<MailTransporterFactory>(
          DIToken.MailTransporterFactory,
        )(MailTransporter.Smtp) as Smtp;
      };

      beforeEach(() => {
        boot({ env: Env.Testing });
        smtpClient = app.get<() => FakeSmtpClient>(DIToken.SmtpClientFactory)();
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
    });
  });
});
