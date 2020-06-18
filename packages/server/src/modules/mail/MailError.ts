export enum MailError {
  CouldNotBuildTemplate = 'COULD_NOT_BUILD_TEMPLATE',
  MissingTransporterConfig = 'MISSING_TRANSPORTER_CONFIG',
  SandboxEnabledInProduction = 'SANDBOX_IN_PRODUCTION',
  MissingSmtpConfig = 'MISSING_SMTP_CONFIG',
  MissingMailFrom = 'MISSING_MAIL_FROM'
}
