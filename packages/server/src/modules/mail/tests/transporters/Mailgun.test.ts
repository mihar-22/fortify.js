import { URLSearchParams } from 'url';
import { App } from '../../../../App';
import { bootstrap } from '../../../../bootstrap';
import { Mailgun, MailgunConfig } from '../../transporters';
import { DIToken } from '../../../../DIToken';
import { Config, Env } from '../../../../Config';
import { FakeHttpClient } from '../../../http/FakeHttpClient';
import { coreModules } from '../../../index';

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

      const boot = (config?: Config) => {
        app = bootstrap(coreModules, config, true);
      };

      beforeEach(() => {
        boot({ env: Env.Testing });
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
    });
  });
});
