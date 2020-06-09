import { Errors, ConfigurationError, RuntimeError } from '../../support/errors';
import { Module } from '../Module';

export enum MailError {
  MissingSmtpConfig = 'MISSING_SMTP_CONFIG',
  MissingFromConfig = 'MISSING_FROM_CONFIG',
  CouldNotFindTemplate = 'COULD_NOT_FIND_TEMPLATE',
}

export const MailErrors: Errors<MailError, Module> = {
  [MailError.MissingSmtpConfig]: () => new ConfigurationError(
    MailError.MissingSmtpConfig,
    'The SMTP mail transporter was selected but no configuration has been specified.',
    Module.Mail,
    `config.${Module.Mail}.smtp`,
  ),
  [MailError.MissingFromConfig]: () => new ConfigurationError(
    MailError.MissingFromConfig,
    'Mail cannot be sent without the from field being set.',
    Module.Mail,
    `config.${Module.Mail}.from`,
  ),
  [MailError.CouldNotFindTemplate]: (template?: string) => new RuntimeError(
    MailError.CouldNotFindTemplate,
    `Could not find a mail template at the path: [${template}]`,
    Module.Mail,
  ),
};
