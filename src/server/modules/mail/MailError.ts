import {
  ConfigurationError,
  RuntimeError,
  ErrorContextRecord, ErrorBuilderRecord,
} from '../../support/errors';
import { Module } from '../Module';

export enum MailErrorCode {
  MissingSmtpConfig = 'MISSING_SMTP_CONFIG',
  MissingFromConfig = 'MISSING_FROM_CONFIG',
  CouldNotBuildTemplate = 'COULD_NOT_BUILD_TEMPLATE',
}

export interface MailErrorContext extends ErrorContextRecord<MailErrorCode> {
  [MailErrorCode.MissingFromConfig]: {}
  [MailErrorCode.MissingFromConfig]: {}
  [MailErrorCode.CouldNotBuildTemplate]: { template?: string, reference?: Error }
}

export const MailError: ErrorBuilderRecord<MailErrorCode, MailErrorContext> = {
  [MailErrorCode.MissingSmtpConfig]: () => new ConfigurationError(
    MailErrorCode.MissingSmtpConfig,
    'The SMTP mail transporter was selected but no configuration has been specified.',
    Module.Mail,
    `config.${Module.Mail}.smtp`,
  ),

  [MailErrorCode.MissingFromConfig]: () => new ConfigurationError(
    MailErrorCode.MissingFromConfig,
    'Mail cannot be sent without the from field being set.',
    Module.Mail,
    `config.${Module.Mail}.from`,
  ),

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
