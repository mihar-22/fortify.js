import { App } from '../../../../App';
import { bootstrap } from '../../../../bootstrap';
import { DIToken } from '../../../../DIToken';
import { Config, Env } from '../../../../Config';
import { FakeHttpClient } from '../../../http/FakeHttpClient';
import { SendGrid, SendGridConfig } from '../../transporters';
import { coreModules } from '../../../index';

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
        app = bootstrap(coreModules, config, true);
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
    });
  });
});
