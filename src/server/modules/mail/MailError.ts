import { RuntimeError, ErrorContextRecord, ErrorBuilderRecord } from '../../support/errors';
import { Module } from '../Module';

export enum MailErrorCode {
  CouldNotBuildTemplate = 'COULD_NOT_BUILD_TEMPLATE',
}

export interface MailErrorContext extends ErrorContextRecord<MailErrorCode> {
  [MailErrorCode.CouldNotBuildTemplate]: { template?: string, reference?: Error }
}

export const MailError: ErrorBuilderRecord<MailErrorCode, MailErrorContext> = {
  [MailErrorCode.CouldNotBuildTemplate]: (context) => new RuntimeError(
    MailErrorCode.CouldNotBuildTemplate,
    `Could not build mail template [${context!.template}]`,
    Module.Mail,
    context!.reference,
    [
      'The template file may have not been created.',
      'The template contains data that was not included in `mail.data`.',
    ],
  ),
};
