import Errors from '../../support/errors/Errors';
import ConfigurationError from '../../support/errors/ConfigurationError';
import Module from '../Module';

export enum MailErrorCode {
  MissingSmtpConfig = 'MISSING_SMTP_CONFIG',
}

export const MailError: Errors<MailErrorCode> = {
  [MailErrorCode.MissingSmtpConfig]: new ConfigurationError(
    MailErrorCode.MissingSmtpConfig,
    'The SMTP mail driver was selected but no configuration has been specified.',
    Module.Mail,
    `config.${Module.Mail}.smtp`,
  ),
};
