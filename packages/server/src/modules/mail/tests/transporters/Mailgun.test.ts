import { URLSearchParams } from 'url';
import { App } from '../../../../App';
import { bootstrap } from '../../../../bootstrap';
import { EventsModule } from '../../../events/EventsModule';
import { MailModule } from '../../MailModule';
import { Mailgun, MailgunConfig } from '../../transporters';
import { HttpModule } from '../../../http/HttpModule';
import { DIToken } from '../../../../DIToken';
import { LoggerModule } from '../../../logger/LoggerModule';
import { Config, Env } from '../../../../Config';
import { FakeHttpClient } from '../../../http/FakeHttpClient';

describe('Mail', () => {
  describe('Transporters', () => {
    describe('Mailgun', () => {
      let app: App;
      let mailer: Mailgun;
      let httpClient: FakeHttpClient;

      const mailSender = 'Test App <no-reply@localhost.com>';
      const mailRecipient = 'john_doe@localhost.com';

      const fakeConfig: MailgunConfig = {
        domain: 'sandbox.com',
        apiKey: 'secret',
      };

      const boot = async (config?: Config) => {
        app = await bootstrap(
          [LoggerModule, HttpModule, EventsModule, MailModule],
          config,
          true,
        );
      };

      beforeEach(async () => {
        await boot({ env: Env.Testing });
        mailer = app.resolve(Mailgun);
        mailer.setConfig(fakeConfig);
        mailer.setSender(mailSender);
        httpClient = app.get(DIToken.HttpClient);
      });

      test('sends mail', async () => {
        const expectedUrl = /api\.mailgun\.net\/v3\/sandbox\.com/;
        const expectedResponse = { message: '', success: true };

        httpClient.post(expectedUrl, expectedResponse);

        const response = await mailer.sendMail({
          to: mailRecipient,
          subject: 'Subject',
          text: 'apples',
        });

        httpClient.called(expectedUrl, {
          functionMatcher: (url, opts) => {
            expect((opts.headers as any).Authorization).toEqual(
              `Basic ${Buffer.from(`api:${fakeConfig.apiKey}`).toString('base64')}`,
            );

            expect(opts.body?.toString()).toEqual(new URLSearchParams({
              from: mailSender,
              to: mailRecipient,
              subject: 'Subject',
              text: 'apples',
              html: '',
              'o:testmode': 'no',
            }).toString());

            return true;
          },
        });

        expect(response).toEqual(expectedResponse);
      });

      // test('sends mail e2e', async () => {
      //   await boot({ env: Env.Development });
      //
      //   mailer = app.resolve(Mailgun);
      //   mailer.useSandbox(false);
      //   mailer.setSender(mailSender);
      //
      //   mailer.setConfig({
      //     domain: process.env.MAILGUN_DOMAIN!,
      //     apiKey: process.env.MAILGUN_API_KEY!,
      //   });
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
