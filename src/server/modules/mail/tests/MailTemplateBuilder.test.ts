import { MailTemplateBuilder } from '../MailTemplateBuilder';
import { MailErrorCode } from '../MailError';

describe('Mail', () => {
  describe('MailTemplateBuilder', () => {
    const txtTemplate = require.resolve('./fixtures/dummy-template.txt');
    const htmlTemplate = require.resolve('./fixtures/dummy-template.html');
    const data = { firstName: 'John', lastName: 'Doe' };

    test('should parse text template correctly', async () => {
      const txt = await MailTemplateBuilder.build(txtTemplate, data);
      expect(txt).toContain(`${data.firstName} ${data.lastName}`);
    });

    test('should parse html template correctly', async () => {
      const html = await MailTemplateBuilder.build(htmlTemplate, data);
      expect(html).toContain(`<div>${data.firstName} ${data.lastName}</div>`);
    });

    test('should throw error given template file is missing', async () => {
      await expect(() => MailTemplateBuilder.build('bad.path'))
        .rejects
        .toThrow(MailErrorCode.CouldNotBuildTemplate);
    });

    test('should throw error given template but no data object', async () => {
      await expect(() => MailTemplateBuilder.build(txtTemplate))
        .rejects
        .toThrow(MailErrorCode.CouldNotBuildTemplate);
    });
  });
});
