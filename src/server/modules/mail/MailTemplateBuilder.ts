import { readFile } from 'fs';
import { promisify } from 'util';
import Mustache from 'mustache';
import { MailErrorCode, MailError } from './MailError';

export class MailTemplateBuilder {
  public static async build(template: string, data?: any): Promise<string> {
    try {
      const fileContent = await promisify(readFile)(template);
      return Mustache.render(fileContent.toString('utf-8'), data);
    } catch (e) {
      throw MailError[MailErrorCode.CouldNotBuildTemplate]({ template });
    }
  }
}
