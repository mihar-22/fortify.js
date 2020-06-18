import { App } from '../../../../App';
import { bootstrap } from '../../../../bootstrap';
import { EventsModule } from '../../../events/EventsModule';
import { MailModule } from '../../MailModule';
import { HttpModule } from '../../../http/HttpModule';
import { DIToken } from '../../../../DIToken';
import { LoggerModule } from '../../../logger/LoggerModule';
import { Config, Env } from '../../../../Config';
import { FakeHttpClient } from '../../../http/FakeHttpClient';
import { SendGrid, SendGridConfig } from '../../transporters';

describe('Mail', () => {
  describe('Transporters', () => {
    describe('SendGrid', () => {
      let app: App;
      let mailer: SendGrid;
      let httpClient: FakeHttpClient;

      const mailSender = 'Test App <no-reply@localhost.com>';
      const mailRecipient = 'john_doe@localhost.com';
      const fakeConfig: SendGridConfig = { apiKey: 'secret' };

      const boot = (config?: Config) => {
        app = bootstrap(
          [LoggerModule, HttpModule, EventsModule, MailModule],
          config,
          true,
        );
      };

      beforeEach(() => {
        boot({ env: Env.Testing });
        mailer = app.resolve(SendGrid);
        mailer.setConfig(fakeConfig);
        mailer.setSender(mailSender);
        httpClient = app.get(DIToken.HttpClient);
      });

      test('sends mail', async () => {
        const expectedUrl = /api\.sendgrid\.com/;
        const expectedResponse = { message: '', success: true };

        httpClient.post(expectedUrl, expectedResponse);

        const response = await mailer.sendMail({
          to: mailRecipient,
          subject: 'Subject',
          text: 'apples',
        });

        expect(response).toEqual(expectedResponse);
      });

      // test('sends mail e2e', async () => {
      //   boot({ env: Env.Development });
      //
      //   mailer = app.resolve(SendGrid);
      //   mailer.setConfig({ apiKey: process.env.SENDGRID_API_KEY! });
      //   mailer.useSandbox(false);
      //   mailer.setSender(mailSender);
      //
      //   const response = await mailer.sendMail({
      //     to: process.env.MAILGUN_AUTHORIZED_RECIPIENT!,
      //     subject: 'Subject',
      //     text: 'apples',
      //   });
      //
      //   console.log(response);
      //   expect(response).toBeDefined();
      // });
    });
  });
});
