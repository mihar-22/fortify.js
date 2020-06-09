import { readFile } from 'fs';
import { promisify } from 'util';
import Mustache from 'mustache';
import { MailError, MailErrors } from './MailErrors';

export class MailTemplateBuilder {
  public static async build<T extends object>(
    template: string,
    data?: T,
  ): Promise<string> {
    try {
      const fileContent = await promisify(readFile)(template);
      return Mustache.render(fileContent.toString('utf-8'), data);
    } catch (e) {
      console.log(e);
      throw MailErrors[MailError.CouldNotFindTemplate](template);
    }
  }
}
