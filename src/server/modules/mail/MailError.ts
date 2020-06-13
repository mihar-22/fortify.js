import { RuntimeError } from '../../support/errors';
import { Module } from '../Module';

export enum MailErrorCode {
  CouldNotBuildTemplate = 'COULD_NOT_BUILD_TEMPLATE',
}

export const MailError = {
  [MailErrorCode.CouldNotBuildTemplate]: (template?: string, reference?: Error) => new RuntimeError(
    MailErrorCode.CouldNotBuildTemplate,
    `Could not build mail template [${template}]`,
    Module.Mail,
    reference,
    [
      'The template file may have not been created.',
      'The template contains data that was not included in `mail.data`.',
    ],
  ),
};
