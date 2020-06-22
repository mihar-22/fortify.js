import { readFile } from 'fs';
import { promisify } from 'util';
import { MailError } from './MailError';
import { RuntimeError } from '../../support/errors';
import { Module } from '../Module';

export class MailTemplateRenderer {
  public static async render(template: string, data?: any): Promise<string> {
    try {
      const fileContent = await promisify(readFile)(template);
      return require('mustache').render(fileContent.toString('utf-8').trim(), data);
    } catch (reference) {
      throw new RuntimeError(
        MailError.CouldNotBuildTemplate,
        `Could not build mail template [${template}]`,
        Module.Mail,
        reference,
        [
          'The template file may have not been created.',
          'The template contains data that was not included in `mail.data`.',
        ],
      );
    }
  }
}
